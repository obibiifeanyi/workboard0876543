
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Eye, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateSiteForm } from "../telecom/CreateSiteForm";
import { EditSiteForm } from "../telecom/EditSiteForm";
import { SiteReports } from "../telecom/SiteReports";
import { TelecomSiteRow } from "@/integrations/supabase/types/telecom";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TelecomSiteManagement = () => {
  const [sites, setSites] = useState<TelecomSiteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSite, setSelectedSite] = useState<TelecomSiteRow | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
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

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;

    try {
      const { error } = await supabase
        .from('telecom_sites')
        .delete()
        .eq('id', siteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Site deleted successfully",
      });

      fetchSites();
    } catch (error) {
      console.error('Error deleting site:', error);
      toast({
        title: "Error",
        description: "Failed to delete site",
        variant: "destructive",
      });
    }
  };

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.site_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      case 'planned': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleViewReports = (site: TelecomSiteRow) => {
    setSelectedSite(site);
    setIsReportsOpen(true);
  };

  const handleEditSite = (site: TelecomSiteRow) => {
    setSelectedSite(site);
    setIsEditFormOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading telecom sites...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Telecom Site Management</h2>
          <p className="text-muted-foreground text-sm md:text-base">Manage telecom sites and infrastructure</p>
        </div>
        <Button 
          onClick={() => setIsCreateFormOpen(true)}
          className="rounded-[30px] bg-primary hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Site
        </Button>
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSites.map((site) => (
          <Card key={site.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <MapPin className="h-8 w-8 text-primary flex-shrink-0" />
                <Badge className={`${getStatusColor(site.status)} text-white text-xs`}>
                  {site.status || 'unknown'}
                </Badge>
              </div>
              <CardTitle className="text-base md:text-lg line-clamp-2">{site.name}</CardTitle>
              {site.site_number && (
                <p className="text-sm text-muted-foreground">#{site.site_number}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-muted-foreground flex-shrink-0">Location:</span>
                    <span className="text-right text-xs line-clamp-2">{site.location}</span>
                  </div>
                  {site.region && (
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-muted-foreground flex-shrink-0">Region:</span>
                      <span className="text-right text-xs">{site.region}</span>
                    </div>
                  )}
                  {site.address && (
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-muted-foreground flex-shrink-0">Address:</span>
                      <span className="text-right text-xs line-clamp-2">{site.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-[30px] flex-1 min-w-0"
                    onClick={() => handleViewReports(site)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Reports</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-[30px]"
                    onClick={() => handleEditSite(site)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-[30px] text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteSite(site.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Site Dialog */}
      <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Telecom Site</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <CreateSiteForm onSuccess={() => {
              setIsCreateFormOpen(false);
              fetchSites();
            }} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Site Dialog */}
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {selectedSite && (
              <EditSiteForm 
                site={selectedSite}
                onSuccess={() => {
                  setIsEditFormOpen(false);
                  fetchSites();
                }} 
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Site Reports Dialog */}
      <Dialog open={isReportsOpen} onOpenChange={setIsReportsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Site Reports - {selectedSite?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {selectedSite && <SiteReports siteId={selectedSite.id} />}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {filteredSites.length === 0 && !loading && (
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
