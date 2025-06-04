
// @ts-ignore - Ignore missing type declarations
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// @ts-ignore - Ignore missing type declarations
import { User, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
// @ts-ignore - Ignore missing type declarations
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const ProfileSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    bio: '',
    location: '',
  });

  // Fetch profile data with React Query using a consistent key
  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['staff-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for profile fetch');
        throw new Error('No user ID');
      }
      
      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
      
      console.log('Profile fetched successfully:', data);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (replaced cacheTime with gcTime)
  });

  // Update form data when profile data changes
  useEffect(() => {
    if (profile) {
      console.log('Updating form data with profile:', profile);
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        position: profile.position || '',
        department: profile.department || '',
        bio: profile.bio || '',
        location: profile.location || '',
      });
    }
  }, [profile, user?.email]);

  const updateProfile = useMutation({
    mutationFn: async (updates: any) => {
      if (!user?.id) throw new Error('No user ID');

      console.log('Updating profile with data:', updates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }
      
      console.log('Profile updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Update mutation successful:', data);
      
      // Update all related query caches
      queryClient.setQueryData(['staff-profile', user?.id], data);
      queryClient.setQueryData(['profile', user?.id], data);
      queryClient.setQueryData(['user_profile'], data);
      
      // Invalidate all profile-related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['staff-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user_profile'] });
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      
      // Force a refetch to ensure we have the latest data
      refetch();
    },
    onError: (error: any) => {
      console.error('Profile update failed:', error);
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!formData.full_name || !formData.email) {
      toast({
        title: 'Missing required fields',
        description: 'Full name and email are required.',
        variant: 'destructive',
      });
      return;
    }
    console.log('Saving profile data:', formData);
    updateProfile.mutate(formData);
    console.log('handleSave function called');
  };

  const handleCancel = () => {
    if (profile) {
      console.log('Canceling edit, reverting to:', profile);
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        position: profile.position || '',
        department: profile.department || '',
        bio: profile.bio || '',
        location: profile.location || '',
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating form field ${field} to:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardContent className="p-6">
          <div className="text-center">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Profile loading error:', error);
    return (
      <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">Error loading profile: {error.message}</div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={handleSave}
                disabled={updateProfile.isPending}
                aria-label="Save profile changes"
              >
                <Save className="w-4 h-4 mr-1" />
                {updateProfile.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
                disabled={updateProfile.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
        {isEditing && updateProfile.isError && (
          <p className="text-red-500 text-xs mt-2 text-center">{updateProfile.error?.message || 'Failed to update profile.'}</p>
        )}
        {isEditing && updateProfile.isSuccess && (
          <p className="text-green-600 text-xs mt-2 text-center">Profile updated successfully!</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            {isEditing ? (
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-sm bg-white/5 p-2 rounded">{formData.full_name || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            ) : (
              <p className="text-sm bg-white/5 p-2 rounded">{formData.email || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            ) : (
              <p className="text-sm bg-white/5 p-2 rounded">{formData.phone || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            {isEditing ? (
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Enter your position"
              />
            ) : (
              <p className="text-sm bg-white/5 p-2 rounded">{formData.position || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            {isEditing ? (
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Enter your department"
              />
            ) : (
              <p className="text-sm bg-white/5 p-2 rounded">{formData.department || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter your location"
              />
            ) : (
              <p className="text-sm bg-white/5 p-2 rounded">{formData.location || 'Not provided'}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-sm bg-white/5 p-3 rounded min-h-[60px]">
              {formData.bio || 'No bio provided'}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm font-medium">Account Type</p>
            <p className="text-sm text-muted-foreground capitalize">{profile?.account_type || 'staff'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm text-muted-foreground capitalize">{profile?.status || 'active'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
