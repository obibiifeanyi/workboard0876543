import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, FileText, TrendingUp, Brain, AlertCircle, CheckCircle2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Cell, ResponsiveContainer, LineChart, Line } from "recharts";

const COLORS = ['#ff1c04', '#0FA0CE', '#10B981', '#F59E0B', '#8B5CF6'];

interface AnalysisResult {
  categories?: string[];
  sentiment?: string;
  urgency?: string;
  confidence?: number;
  [key: string]: any;
}

export const DocumentAnalytics = () => {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['document-analytics'],
    queryFn: async () => {
      try {
        // Get document analysis data
        const { data: analysisData, error: analysisError } = await supabase
          .from('document_analysis')
          .select('*');

        if (analysisError) {
          console.error('Error fetching document analysis:', analysisError);
          throw analysisError;
        }

        // Get documents data
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select('*');

        if (documentsError) {
          console.error('Error fetching documents:', documentsError);
        }

        // Get memos data
        const { data: memosData, error: memosError } = await supabase
          .from('memos')
          .select('*');

        if (memosError) {
          console.error('Error fetching memos:', memosError);
        }

        const totalDocuments = (documentsData?.length || 0) + (memosData?.length || 0);
        const totalAnalyses = analysisData?.length || 0;
        const completedAnalyses = analysisData?.filter(doc => doc.status === 'completed').length || 0;
        const pendingAnalyses = analysisData?.filter(doc => doc.status === 'pending').length || 0;
        const errorAnalyses = analysisData?.filter(doc => doc.status === 'error').length || 0;
        
        // Calculate success rate
        const successRate = totalAnalyses > 0 ? Math.round((completedAnalyses / totalAnalyses) * 100) : 0;

        // Analyze categories from completed analyses
        const categoryData: { [key: string]: number } = {};
        const sentimentData: { [key: string]: number } = {};
        const urgencyData: { [key: string]: number } = {};

        analysisData?.forEach(analysis => {
          if (analysis.status === 'completed' && analysis.analysis_result) {
            const result = analysis.analysis_result as AnalysisResult;
            
            // Process categories
            if (result.categories && Array.isArray(result.categories)) {
              result.categories.forEach((cat: string) => {
                categoryData[cat] = (categoryData[cat] || 0) + 1;
              });
            }

            // Process sentiment
            if (result.sentiment && typeof result.sentiment === 'string') {
              sentimentData[result.sentiment] = (sentimentData[result.sentiment] || 0) + 1;
            }

            // Process urgency
            if (result.urgency && typeof result.urgency === 'string') {
              urgencyData[result.urgency] = (urgencyData[result.urgency] || 0) + 1;
            }
          }
        });

        // Convert to chart format
        const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: COLORS[Object.keys(categoryData).indexOf(name) % COLORS.length]
        }));

        const sentimentChartData = Object.entries(sentimentData).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: name === 'positive' ? '#10B981' : name === 'negative' ? '#EF4444' : '#F59E0B'
        }));

        const urgencyChartData = Object.entries(urgencyData).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: name === 'critical' ? '#EF4444' : name === 'high' ? '#F59E0B' : name === 'medium' ? '#0FA0CE' : '#10B981'
        }));

        // Recent analysis trend (last 7 days)
        const last7Days = Array.from({length: 7}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toISOString().split('T')[0];
        });

        const trendData = last7Days.map(date => {
          const count = analysisData?.filter(analysis => 
            analysis.created_at?.startsWith(date) && analysis.status === 'completed'
          ).length || 0;
          return {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            analyses: count
          };
        });

        return {
          totalDocuments,
          totalAnalyses,
          completedAnalyses,
          pendingAnalyses,
          errorAnalyses,
          successRate,
          categoryChartData,
          sentimentChartData,
          urgencyChartData,
          trendData,
          recentAnalyses: analysisData?.slice(0, 5) || []
        };
      } catch (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Analytics</h3>
          <p className="text-muted-foreground">Failed to load document analytics. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: "Total Documents",
      value: analytics?.totalDocuments || 0,
      icon: FileText,
      color: "text-blue-600",
      description: "Documents & Memos"
    },
    {
      title: "AI Analyses",
      value: analytics?.completedAnalyses || 0,
      icon: Brain,
      color: "text-green-600",
      description: "Successfully analyzed"
    },
    {
      title: "Pending",
      value: analytics?.pendingAnalyses || 0,
      icon: BarChart3,
      color: "text-orange-600",
      description: "Awaiting analysis"
    },
    {
      title: "Success Rate",
      value: `${analytics?.successRate || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      description: "Analysis accuracy"
    }
  ];

  const chartConfig = {
    categories: { label: "Document Categories" },
    sentiment: { label: "Sentiment Analysis" },
    urgency: { label: "Urgency Levels" },
    trend: { label: "Analysis Trend" }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Analysis Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.trendData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="analyses" stroke="#ff1c04" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          {analytics.categoryChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Document Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.categoryChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="#ff1c04" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Sentiment Analysis */}
          {analytics.sentimentChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <PieChart data={analytics.sentimentChartData} cx="50%" cy="50%" outerRadius={80}>
                        {analytics.sentimentChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </PieChart>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Urgency Levels */}
          {analytics.urgencyChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Urgency Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.urgencyChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="#0FA0CE" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent Analyses */}
      {analytics && analytics.recentAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentAnalyses.map((analysis: any) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      analysis.status === 'completed' ? 'bg-green-100 text-green-600' :
                      analysis.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {analysis.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> :
                       analysis.status === 'pending' ? <BarChart3 className="h-4 w-4" /> :
                       <AlertCircle className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{analysis.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      analysis.status === 'completed' ? 'bg-green-100 text-green-800' :
                      analysis.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
