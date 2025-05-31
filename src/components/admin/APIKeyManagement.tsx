
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Key, DollarSign, Activity, Shield, Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface APIKey {
  id: string;
  name: string;
  key_type: string;
  usage_limit: number;
  current_usage: number;
  cost_per_request: number;
  total_cost: number;
  is_active: boolean;
  created_at: string;
  last_used: string | null;
}

interface APIUsage {
  id: string;
  api_key_id: string;
  user_id: string;
  endpoint: string;
  request_count: number;
  cost: number;
  date: string;
  profiles?: {
    full_name: string;
  };
}

export const APIKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [apiUsage, setApiUsage] = useState<APIUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<APIKey | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    key_type: "",
    usage_limit: 1000,
    cost_per_request: 0.01,
  });

  useEffect(() => {
    fetchAPIKeys();
    fetchAPIUsage();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Error",
        description: "Failed to fetch API keys",
        variant: "destructive",
      });
    }
  };

  const fetchAPIUsage = async () => {
    try {
      const { data, error } = await supabase
        .from('api_usage')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setApiUsage(data || []);
    } catch (error) {
      console.error('Error fetching API usage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      if (editingKey) {
        const { error } = await supabase
          .from('api_keys')
          .update({
            name: formData.name,
            usage_limit: formData.usage_limit,
            cost_per_request: formData.cost_per_request,
          })
          .eq('id', editingKey.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "API key updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('api_keys')
          .insert({
            name: formData.name,
            key_type: formData.key_type,
            usage_limit: formData.usage_limit,
            cost_per_request: formData.cost_per_request,
            created_by: user.user.id,
          });

        if (error) throw error;
        toast({
          title: "Success",
          description: "API key created successfully",
        });
      }

      setFormData({ name: "", key_type: "", usage_limit: 1000, cost_per_request: 0.01 });
      setEditingKey(null);
      setIsDialogOpen(false);
      fetchAPIKeys();
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  const toggleKeyStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      fetchAPIKeys();
      toast({
        title: "Success",
        description: `API key ${!isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating API key:', error);
      toast({
        title: "Error",
        description: "Failed to update API key status",
        variant: "destructive",
      });
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAPIKeys();
      toast({
        title: "Success",
        description: "API key deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const totalCost = apiKeys.reduce((sum, key) => sum + key.total_cost, 0);
  const totalUsage = apiKeys.reduce((sum, key) => sum + key.current_usage, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">API Key Management</h2>
          <p className="text-muted-foreground">Manage API keys and monitor usage</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-[30px]">
              <Key className="mr-2 h-4 w-4" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[30px]">
            <DialogHeader>
              <DialogTitle>{editingKey ? 'Edit' : 'Add'} API Key</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-[30px]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="key_type">API Type</Label>
                <Select
                  value={formData.key_type}
                  onValueChange={(value) => setFormData({ ...formData, key_type: value })}
                >
                  <SelectTrigger className="rounded-[30px]">
                    <SelectValue placeholder="Select API type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google AI</SelectItem>
                    <SelectItem value="aws">AWS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="usage_limit">Usage Limit</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
                  className="rounded-[30px]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cost_per_request">Cost per Request ($)</Label>
                <Input
                  id="cost_per_request"
                  type="number"
                  step="0.001"
                  value={formData.cost_per_request}
                  onChange={(e) => setFormData({ ...formData, cost_per_request: Number(e.target.value) })}
                  className="rounded-[30px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full rounded-[30px]">
                {editingKey ? 'Update' : 'Create'} API Key
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.filter(key => key.is_active).length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <div className="grid gap-4">
            {apiKeys.map((key) => (
              <Card key={key.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{key.name}</h3>
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{key.key_type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Usage: {key.current_usage} / {key.usage_limit} | 
                        Cost: ${key.total_cost.toFixed(2)} | 
                        Rate: ${key.cost_per_request}/request
                      </div>
                      {key.last_used && (
                        <div className="text-xs text-muted-foreground">
                          Last used: {new Date(key.last_used).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingKey(key);
                          setFormData({
                            name: key.name,
                            key_type: key.key_type,
                            usage_limit: key.usage_limit,
                            cost_per_request: key.cost_per_request,
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyStatus(key.id, key.is_active)}
                      >
                        {key.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteApiKey(key.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent API Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiUsage.map((usage) => (
                  <div key={usage.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{usage.profiles?.full_name || 'Unknown User'}</div>
                      <div className="text-sm text-muted-foreground">
                        {usage.endpoint} | {usage.request_count} requests
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(usage.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${usage.cost.toFixed(3)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
