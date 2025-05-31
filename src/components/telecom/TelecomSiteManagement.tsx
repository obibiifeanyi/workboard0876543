
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, FileText, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SiteReportForm } from "./SiteReportForm";
import { SiteReports } from "./SiteReports";

interface TelecomSite {
  id: string;
  name: string;
  site_number?: string;
  location: string;
  address?: string;
  region?: string;
  status: string;
  installation_date?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  notes?: string;
}

export const TelecomSiteManagement = () => {
  const [sites, setSites] = useState<TelecomSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from('telecom_sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      toast({
        title: "Error",
        description: "Failed to fetch telecom sites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.site_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      case 'planned': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleViewReports = (siteId: string) => {
    setSelectedSiteId(siteId);
    setIsReportsOpen(true);
  };

  const handleCreateReport = (siteId: string) => {
    setSelectedSiteId(siteId);
    setIsReportFormOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading telecom sites...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Telecom Site Management</h2>
          <p className="text-muted-foreground">Monitor and manage telecom sites and reports</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-[30px]"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSites.map((site) => (
          <Card key={site.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <MapPin className="h-8 w-8 text-primary" />
                <Badge className={`${getStatusColor(site.status)} text-white`}>
                  {site.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{site.name}</CardTitle>
              {site.site_number && (
                <p className="text-sm text-muted-foreground">#{site.site_number}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{site.location}</span>
                  </div>
                  {site.region && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Region:</span>
                      <span>{site.region}</span>
                    </div>
                  )}
                  {site.last_maintenance && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Maintenance:</span>
                      <span>{new Date(site.last_maintenance).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-[30px] flex-1"
                    onClick={() => handleViewReports(site.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Reports
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-[30px] flex-1"
                    onClick={() => handleCreateReport(site.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Site Reports Dialog */}
      <Dialog open={isReportsOpen} onOpenChange={setIsReportsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Site Reports</DialogTitle>
          </DialogHeader>
          {selectedSiteId && <SiteReports siteId={selectedSiteId} />}
        </DialogContent>
      </Dialog>

      {/* Report Form Dialog */}
      <Dialog open={isReportFormOpen} onOpenChange={setIsReportFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Site Report</DialogTitle>
          </DialogHeader>
          {selectedSiteId && (
            <SiteReportForm 
              siteId={selectedSiteId}
              onSuccess={() => {
                setIsReportFormOpen(false);
                toast({
                  title: "Success",
                  description: "Site report created successfully",
                });
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {filteredSites.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No sites found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Create your first telecom site to get started"}
          </p>
        </div>
      )}
    </div>
  );
};
