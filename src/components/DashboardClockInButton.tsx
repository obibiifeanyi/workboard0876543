
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Timer, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const DashboardClockInButton = () => {
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Reset success state after delay
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (isSuccess) {
      timeoutId = setTimeout(() => {
        setIsSuccess(false);
        setSuccessMessage(null);
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSuccess]);

  const handleClockIn = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to clock in/out",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
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

                const successMsg = `You worked ${totalHours.toFixed(2)} hours today.`;
                setSuccessMessage(successMsg);
                setIsSuccess(true);
                
                toast({
                  title: "Clock Out Successful",
                  description: successMsg,
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

                const successMsg = "Your location and time have been recorded.";
                setSuccessMessage(successMsg);
                setIsSuccess(true);
                
                toast({
                  title: "Clock In Successful",
                  description: successMsg,
                });
              }
            } catch (dbError) {
              console.error("Database error:", dbError);
              const errorMsg = "Failed to record time log. Please try again.";
              setErrorMessage(errorMsg);
              
              toast({
                title: "Error",
                description: errorMsg,
                variant: "destructive",
              });
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            const errorMsg = "Please enable location services to clock in.";
            setErrorMessage(errorMsg);
            
            toast({
              title: "Location Error",
              description: errorMsg,
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
        const errorMsg = "Your browser doesn't support location services.";
        setErrorMessage(errorMsg);
        
        toast({
          title: "Location Not Supported",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Clock in error:", error);
      const errorMsg = "Failed to clock in. Please try again.";
      setErrorMessage(errorMsg);
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Button
        onClick={handleClockIn}
        disabled={isSubmitting}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border-primary/20"
      >
        <Timer className={`h-4 w-4 ${isSubmitting ? 'animate-spin' : ''}`} />
        {isSubmitting ? "Processing..." : "Clock In/Out"}
      </Button>
      
      {/* Success message */}
      {isSuccess && successMessage && (
        <div className="text-xs bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-2 rounded-md flex items-center gap-1.5">
          <CheckCircle size={12} className="text-green-600 dark:text-green-400" />
          <span>{successMessage}</span>
        </div>
      )}
      
      {/* Error message */}
      {errorMessage && (
        <div className="text-xs bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-2 rounded-md flex items-center gap-1.5">
          <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
