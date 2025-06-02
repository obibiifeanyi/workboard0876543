
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, Filter, Eye, Edit, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

interface TelecomReport {
  id: string;
  site_id?: string;
  report_category: string;
  priority_level: string;
  resolution_status: string;
  signal_strength?: number;
  network_status: string;
  equipment_status: string;
  issues_reported?: string;
  recommendations?: string;
  generator_runtime?: number;
  diesel_level?: number;
  power_status?: string;
  customer_complaint_details?: string;
  security_incident_type?: string;
  security_details?: string;
  uncategorized_type?: string;
  report_date: string;
  created_at: string;
  reporter?: { full_name: string };
  site?: { name: string };
}

export const TelecomReportsDashboard = () => {
  const [reports, setReports] = useState<TelecomReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const result = await ApiService.getTelecomReports();
      if (result.success) {
        setReports(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error fetching telecom reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch telecom reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.site?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.issues_reported?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.equipment_status?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || report.report_category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || report.priority_level === priorityFilter;
    const matchesStatus = statusFilter === "all" || report.resolution_status === statusFilter;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'power': return '⚡';
      case 'customer_complaint': return '📞';
      case 'security': return '🔒';
      case 'uncategorized': return '❓';
      default: return '📊';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'pending': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading telecom reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Telecom Reports Dashboard</h2>
          <p className="text-muted-foreground">Monitor and manage telecom site reports</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="power">Power</SelectItem>
                <SelectItem value="customer_complaint">Customer Complaint</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="uncategorized">Uncategorized</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid gap-6">
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No reports found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== "all" || priorityFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No telecom reports have been created yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(report.report_category)}</span>
                    <div>
                      <CardTitle className="text-lg">
                        {report.site?.name || `Site ${report.site_id}`} - {report.report_category.replace('_', ' ').toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Reported by {report.reporter?.full_name} on {formatDate(report.report_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${getPriorityColor(report.priority_level)} text-white`}>
                      {report.priority_level}
                    </Badge>
                    <Badge className={`${getStatusColor(report.resolution_status)} text-white`}>
                      {report.resolution_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    {report.report_category === 'power' && <TabsTrigger value="power">Power</TabsTrigger>}
                    {report.report_category === 'customer_complaint' && <TabsTrigger value="complaint">Complaint</TabsTrigger>}
                    {report.report_category === 'security' && <TabsTrigger value="security">Security</TabsTrigger>}
                  </TabsList>

                  <TabsContent value="overview" className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Network Status:</span> {report.network_status}
                      </div>
                      {report.signal_strength && (
                        <div>
                          <span className="font-medium">Signal Strength:</span> {report.signal_strength} dBm
                        </div>
                      )}
                    </div>
                    
                    {report.equipment_status && (
                      <div>
                        <span className="font-medium">Equipment Status:</span>
                        <p className="mt-1 text-sm">{report.equipment_status}</p>
                      </div>
                    )}

                    {report.issues_reported && (
                      <div>
                        <span className="font-medium">Issues Reported:</span>
                        <p className="mt-1 text-sm">{report.issues_reported}</p>
                      </div>
                    )}

                    {report.recommendations && (
                      <div>
                        <span className="font-medium">Recommendations:</span>
                        <p className="mt-1 text-sm">{report.recommendations}</p>
                      </div>
                    )}
                  </TabsContent>

                  {report.report_category === 'power' && (
                    <TabsContent value="power" className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {report.generator_runtime && (
                          <div>
                            <span className="font-medium">Generator Runtime:</span> {report.generator_runtime} hours
                          </div>
                        )}
                        {report.diesel_level && (
                          <div>
                            <span className="font-medium">Diesel Level:</span> {report.diesel_level}%
                          </div>
                        )}
                        {report.power_status && (
                          <div>
                            <span className="font-medium">Power Status:</span> {report.power_status.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  )}

                  {report.report_category === 'customer_complaint' && (
                    <TabsContent value="complaint" className="space-y-3">
                      {report.customer_complaint_details && (
                        <div>
                          <span className="font-medium">Complaint Details:</span>
                          <p className="mt-1 text-sm">{report.customer_complaint_details}</p>
                        </div>
                      )}
                    </TabsContent>
                  )}

                  {report.report_category === 'security' && (
                    <TabsContent value="security" className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {report.security_incident_type && (
                          <div>
                            <span className="font-medium">Incident Type:</span> {report.security_incident_type.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                      {report.security_details && (
                        <div>
                          <span className="font-medium">Security Details:</span>
                          <p className="mt-1 text-sm">{report.security_details}</p>
                        </div>
                      )}
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
