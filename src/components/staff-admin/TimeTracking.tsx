import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface TimeEntry {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out: string | null;
  date: string;
  notes: string | null;
}

export const TimeTracking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isClockingIn, setIsClockingIn] = useState(false);

  const { data: timeEntries, isLoading } = useQuery({
    queryKey: ['timeEntries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as TimeEntry[];
    },
  });

  const clockIn = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('time_entries')
        .insert([
          {
            user_id: user.id,
            clock_in: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      toast({
        title: 'Success',
        description: 'Clocked in successfully',
      });
      setIsClockingIn(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to clock in',
        variant: 'destructive',
      });
      setIsClockingIn(false);
    },
  });

  const clockOut = useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from('time_entries')
        .update({ clock_out: new Date().toISOString() })
        .eq('id', entryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      toast({
        title: 'Success',
        description: 'Clocked out successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to clock out',
        variant: 'destructive',
      });
    },
  });

  const handleClockIn = async () => {
    setIsClockingIn(true);
    await clockIn.mutateAsync();
  };

  const handleClockOut = async (entryId: string) => {
    await clockOut.mutateAsync(entryId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleClockIn}
              disabled={isClockingIn}
              className="w-32"
            >
              {isClockingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Clock In'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeEntries?.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Clock In: {new Date(entry.clock_in).toLocaleTimeString()}
                    {entry.clock_out && (
                      <> - Clock Out: {new Date(entry.clock_out).toLocaleTimeString()}</>
                    )}
                  </p>
                </div>
                {!entry.clock_out && (
                  <Button
                    variant="outline"
                    onClick={() => handleClockOut(entry.id)}
                  >
                    Clock Out
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 