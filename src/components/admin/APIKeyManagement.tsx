
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Key, Plus, Edit, Trash2, Eye, EyeOff, Loader, DollarSign } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface APIKey {
  id: string;
  name: string;
  key_type: string;
  usage_limit: number;
  current_usage: number;
  cost_per_request: number;
  total_cost: number;
  is_active: boolean;
  last_used: string | null;
  created_at: string;
  created_by: string;
}

export const APIKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<APIKey | null>(null);
  const [showKeyValues, setShowKeyValues] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    key_type: "",
    usage_limit: "1000",
    cost_per_request: "0.01",
  });

  useEffect(() => {
    fetchAPIKeys();
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const keyData = {
        name: formData.name,
        key_type: formData.key_type,
        usage_limit: parseInt(formData.usage_limit),
        cost_per_request: parseFloat(formData.cost_per_request),
        created_by: user.id,
      };

      if (editingKey) {
        const { error } = await supabase
          .from('api_keys')
          .update(keyData)
          .eq('id', editingKey.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "API key updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('api_keys')
          .insert(keyData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "API key created successfully",
        });
      }

      resetForm();
      fetchAPIKeys();
    } catch (error: any) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key deleted successfully",
      });

      fetchAPIKeys();
    } catch (error: any) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete API key",
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

      toast({
        title: "Success",
        description: `API key ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });

      fetchAPIKeys();
    } catch (error: any) {
      console.error('Error updating API key status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update API key status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      key_type: "",
      usage_limit: "1000",
      cost_per_request: "0.01",
    });
    setEditingKey(null);
    setIsCreateOpen(false);
  };

  const openEditDialog = (apiKey: APIKey) => {
    setFormData({
      name: apiKey.name,
      key_type: apiKey.key_type,
      usage_limit: apiKey.usage_limit.toString(),
      cost_per_request: apiKey.cost_per_request.toString(),
    });
    setEditingKey(apiKey);
    setIsCreateOpen(true);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeyValues(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.round((current / limit) * 100);
  };

  const getUsageBadge = (current: number, limit: number) => {
    const percentage = getUsagePercentage(current, limit);
    if (percentage >= 90) return <Badge variant="destructive">{percentage}%</Badge>;
    if (percentage >= 70) return <Badge className="bg-orange-500">{percentage}%</Badge>;
    return <Badge variant="secondary">{percentage}%</Badge>;
  };

  if (loading && apiKeys.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <Loader className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold">API Key Management</h1>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingKey ? "Edit API Key" : "Create API Key"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., OpenAI Production Key"
                  required
                />
              </div>
              <div>
                <Label htmlFor="key_type">Key Type</Label>
                <Select
                  value={formData.key_type}
                  onValueChange={(value) => setFormData({ ...formData, key_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select key type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="google">Google AI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="usage_limit">Usage Limit</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, cost_per_request: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingKey ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{apiKey.key_type.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getUsageBadge(apiKey.current_usage, apiKey.usage_limit)}
                      <span className="text-sm text-muted-foreground">
                        {apiKey.current_usage}/{apiKey.usage_limit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{apiKey.total_cost.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                      {apiKey.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {apiKey.last_used 
                      ? new Date(apiKey.last_used).toLocaleDateString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKeyValues[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(apiKey)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyStatus(apiKey.id, apiKey.is_active)}
                      >
                        {apiKey.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {apiKeys.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No API keys found. Create your first API key to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
