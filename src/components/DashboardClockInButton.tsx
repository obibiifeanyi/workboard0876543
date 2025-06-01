
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const DashboardClockInButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleClockIn = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const clockInTime = new Date().toISOString();
            
            try {
              // Check if user already has an active clock-in today
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);

              const { data: existingLog } = await supabase
                .from('time_logs')
                .select('*')
                .eq('user_id', user.id)
                .gte('clock_in', today.toISOString())
                .lt('clock_in', tomorrow.toISOString())
                .is('clock_out', null)
                .single();

              if (existingLog) {
                // Clock out existing session
                const clockOutTime = new Date().toISOString();
                const clockInDate = new Date(existingLog.clock_in);
                const clockOutDate = new Date(clockOutTime);
                const totalHours = (clockOutDate.getTime() - clockInDate.getTime()) / (1000 * 60 * 60);

                const { error: updateError } = await supabase
                  .from('time_logs')
                  .update({
                    clock_out: clockOutTime,
                    total_hours: totalHours
                  })
                  .eq('id', existingLog.id);

                if (updateError) throw updateError;

                toast({
                  title: "Clock Out Successful",
                  description: `You worked ${totalHours.toFixed(2)} hours today.`,
                });
              } else {
                // Create new clock-in entry
                const { error: insertError } = await supabase
                  .from('time_logs')
                  .insert({
                    user_id: user.id,
                    clock_in: clockInTime,
                    notes: `Location: ${latitude}, ${longitude}`
                  });

                if (insertError) throw insertError;

                toast({
                  title: "Clock In Successful",
                  description: "Your location and time have been recorded.",
                });
              }
            } catch (dbError) {
              console.error("Database error:", dbError);
              toast({
                title: "Error",
                description: "Failed to record time log. Please try again.",
                variant: "destructive",
              });
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            toast({
              title: "Location Error",
              description: "Please enable location services to clock in.",
              variant: "destructive",
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      } else {
        toast({
          title: "Location Not Supported",
          description: "Your browser doesn't support location services.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Clock in error:", error);
      toast({
        title: "Error",
        description: "Failed to clock in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClockIn}
      disabled={loading}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border-primary/20"
    >
      <Timer className="h-4 w-4" />
      {loading ? "Processing..." : "Clock In/Out"}
    </Button>
  );
};
