
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SiteReport {
  id: string;
  report_type: string;
  title: string;
  description: string;
  status: string;
  data: any;
  report_date: string;
  created_at: string;
}

interface SiteReportsProps {
  siteId: string;
}

export const SiteReports = ({ siteId }: SiteReportsProps) => {
  const [reports, setReports] = useState<SiteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, [siteId]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('site_reports')
        .select('*')
        .eq('site_id', siteId)
        .order('report_date', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch site reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-500';
      case 'inspection': return 'bg-green-500';
      case 'incident': return 'bg-red-500';
      case 'performance': return 'bg-purple-500';
      case 'power': return 'bg-yellow-500';
      case 'battery': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'reviewed': return 'bg-blue-500';
      case 'submitted': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading reports...</div>;
  }

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No reports found</h3>
          <p className="text-muted-foreground">No reports have been created for this site yet.</p>
        </div>
      ) : (
        reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge className={`${getReportTypeColor(report.report_type)} text-white`}>
                    {report.report_type}
                  </Badge>
                  <Badge className={`${getStatusColor(report.status)} text-white`}>
                    {report.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{report.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(report.report_date).toLocaleDateString()}
                  </div>
                </div>

                {report.data && Object.keys(report.data).length > 0 && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Report Data:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(report.data).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {key.replace('_', ' ')}:
                            </span>
                            <span>{value as string}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
