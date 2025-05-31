
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, MapPin, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ConstructionSiteManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    site_name: "",
    site_code: "",
    location: "",
    address: "",
    site_type: "",
    contractor_name: "",
    contractor_contact: "",
    start_date: "",
    expected_completion: "",
    budget_allocated: "",
    notes: "",
  });

  const { data: sites, isLoading } = useQuery({
    queryKey: ['construction-sites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('construction_sites')
        .select(`
          *,
          profiles!construction_sites_site_manager_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createSite = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { error } = await supabase
        .from('construction_sites')
        .insert([{
          site_name: data.site_name,
          site_code: data.site_code || null,
          location: data.location,
          address: data.address || null,
          site_type: data.site_type,
          site_manager_id: user.id,
          contractor_name: data.contractor_name || null,
          contractor_contact: data.contractor_contact || null,
          start_date: data.start_date || null,
          expected_completion: data.expected_completion || null,
          budget_allocated: data.budget_allocated ? parseFloat(data.budget_allocated) : 0,
          notes: data.notes || null,
          status: 'planning'
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['construction-sites'] });
      setIsDialogOpen(false);
      setFormData({
        site_name: "",
        site_code: "",
        location: "",
        address: "",
        site_type: "",
        contractor_name: "",
        contractor_contact: "",
        start_date: "",
        expected_completion: "",
        budget_allocated: "",
        notes: "",
      });
      toast({
        title: "Success",
        description: "Construction site created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create construction site",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      planning: 'bg-blue-500',
      active: 'bg-green-500',
      on_hold: 'bg-yellow-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500'
    };
    
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSite.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-unica">Construction Site Management</h2>
          <p className="text-muted-foreground">Monitor and manage construction sites</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="button-enhanced">
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Construction Site</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={formData.site_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="site_code">Site Code</Label>
                  <Input
                    id="site_code"
                    value={formData.site_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, site_code: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="site_type">Site Type</Label>
                <Select value={formData.site_type} onValueChange={(value) => setFormData(prev => ({ ...prev, site_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select site type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contractor_name">Contractor Name</Label>
                  <Input
                    id="contractor_name"
                    value={formData.contractor_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, contractor_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="contractor_contact">Contractor Contact</Label>
                  <Input
                    id="contractor_contact"
                    value={formData.contractor_contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, contractor_contact: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="expected_completion">Expected Completion</Label>
                  <Input
                    id="expected_completion"
                    type="date"
                    value={formData.expected_completion}
                    onChange={(e) => setFormData(prev => ({ ...prev, expected_completion: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="budget_allocated">Budget Allocated ($)</Label>
                <Input
                  id="budget_allocated"
                  type="number"
                  value={formData.budget_allocated}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_allocated: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <Button type="submit" disabled={createSite.isPending}>
                {createSite.isPending ? "Creating..." : "Create Site"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sites?.map((site) => (
            <Card key={site.id} className="enhanced-card interactive-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Building2 className="h-8 w-8 text-primary" />
                  {getStatusBadge(site.status)}
                </div>
                <CardTitle className="text-lg font-unica">{site.site_name}</CardTitle>
                {site.site_code && (
                  <p className="text-sm text-muted-foreground">#{site.site_code}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{site.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{site.site_type}</span>
                    </div>
                    {site.budget_allocated && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Budget:</span>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${Number(site.budget_allocated).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    {site.start_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(site.start_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {sites && sites.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium font-unica">No construction sites found</h3>
          <p className="text-muted-foreground">
            Create your first construction site to get started
          </p>
        </div>
      )}
    </div>
  );
};
