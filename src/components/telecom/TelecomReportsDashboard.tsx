
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Radio, Search, Filter, Calendar, MapPin, Zap } from "lucide-react";

interface TelecomReport {
  id: string;
  site_id: string;
  report_type: string;
  title: string;
  description: string;
  status: string;
  data: any;
  report_date: string;
  created_at: string;
  telecom_sites?: {
    name: string;
    location: string;
    site_number: string;
  };
}

interface PowerReport {
  id: string;
  site_id: string;
  report_datetime: string;
  power_reading: number;
  battery_status: string;
  diesel_level: number;
  generator_runtime: number;
  comments: string;
  status: string;
}

export const TelecomReportsDashboard = () => {
  const [reports, setReports] = useState<TelecomReport[]>([]);
  const [powerReports, setPowerReports] = useState<PowerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch site reports
      const { data: siteReportsData, error: siteError } = await supabase
        .from('site_reports')
        .select(`
          *,
          telecom_sites (
            name,
            location,
            site_number
          )
        `)
        .eq('reported_by', user.id)
        .order('created_at', { ascending: false });

      if (siteError) throw siteError;

      // Fetch power reports
      const { data: powerReportsData, error: powerError } = await supabase
        .from('ct_power_reports')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (powerError) throw powerError;

      setReports(siteReportsData || []);
      setPowerReports(powerReportsData || []);
      
      console.log('Reports fetched:', { siteReportsData, powerReportsData });
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.telecom_sites?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.telecom_sites?.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesType = typeFilter === "all" || report.report_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500';
      case 'reviewed': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      case 'incident': return 'bg-red-100 text-red-800';
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'power': return 'bg-yellow-100 text-yellow-800';
      case 'battery': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            Telecom Reports Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-[30px]"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] rounded-[30px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] rounded-[30px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="power">Power</SelectItem>
                <SelectItem value="battery">Battery</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchReports} variant="outline" className="rounded-[30px]">
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No reports found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "You haven't submitted any reports yet"
                  }
                </p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(report.report_type)}>
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
                          <MapPin className="h-4 w-4" />
                          {report.telecom_sites?.name} - {report.telecom_sites?.location}
                        </div>
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

          {powerReports.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Recent Power Reports
              </h3>
              <div className="grid gap-4">
                {powerReports.slice(0, 5).map((powerReport) => (
                  <Card key={powerReport.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Zap className="h-4 w-4" />
                            Power Report - {new Date(powerReport.report_datetime).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Power: {powerReport.power_reading}kW • Battery: {powerReport.battery_status} • Diesel: {powerReport.diesel_level}%
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(powerReport.status)} text-white`}>
                          {powerReport.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
