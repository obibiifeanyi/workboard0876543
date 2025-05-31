
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, FileText, TrendingUp, Users } from "lucide-react";

export const DocumentAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['document-analytics'],
    queryFn: async () => {
      try {
        // Get document analysis data
        const { data: analysisData, error: analysisError } = await supabase
          .from('document_analysis')
          .select('*');

        if (analysisError) {
          console.error('Error fetching document analysis:', analysisError);
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
        const completedAnalyses = analysisData?.filter(doc => doc.status === 'completed').length || 0;
        const pendingAnalyses = analysisData?.filter(doc => doc.status === 'pending').length || 0;
        
        return {
          totalDocuments,
          completedAnalyses,
          pendingAnalyses,
          successRate: totalDocuments > 0 ? Math.round((completedAnalyses / totalDocuments) * 100) : 0
        };
      } catch (error) {
        console.error('Error fetching analytics:', error);
        return {
          totalDocuments: 0,
          completedAnalyses: 0,
          pendingAnalyses: 0,
          successRate: 0
        };
      }
    },
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

  const stats = [
    {
      title: "Total Documents",
      value: analytics?.totalDocuments || 0,
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Completed Analyses",
      value: analytics?.completedAnalyses || 0,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Pending Analyses",
      value: analytics?.pendingAnalyses || 0,
      icon: BarChart3,
      color: "text-orange-600"
    },
    {
      title: "Success Rate",
      value: `${analytics?.successRate || 0}%`,
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
