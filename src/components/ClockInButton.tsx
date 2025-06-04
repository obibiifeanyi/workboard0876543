
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const ClockInButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { clockIn, isClockingIn, getCurrentTimeLog } = useTimeTracking();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTimeLog = getCurrentTimeLog();

  const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(coords);
          resolve(coords);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          resolve({ latitude: 0, longitude: 0 }); // Default location if permission denied
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  const handleClockIn = async () => {
    if (isProcessing || isClockingIn) {
      console.log('Already processing clock-in request');
      return;
    }

    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    setError(null);
    console.log('Clock in process started');

    try {
      console.log('Attempting to get location...');
      const coords = await getLocation();
      console.log('Location obtained successfully:', coords);
      
      // Explicitly pass the coordinates as an object with latitude and longitude
      console.log('Calling clockIn mutation with coordinates');
      await new Promise((resolve) => {
        clockIn(
          { latitude: coords.latitude, longitude: coords.longitude },
          {
            onSuccess: (data) => {
              console.log('Clock in successful:', data);
              setIsSuccess(true);
              toast({
                title: "Success",
                description: "You have successfully clocked in.",
              });
              
              // Reset success state after a delay
              setTimeout(() => {
                setIsSuccess(false);
              }, 3000);
              
              resolve(data);
            },
            onError: (err) => {
              console.error('Clock in mutation error:', err);
              setError(err.message || 'Failed to clock in');
              toast({
                title: "Error",
                description: err.message || 'Failed to clock in',
                variant: "destructive",
              });
              resolve(null);
            }
          }
        );
      });
    } catch (error: any) {
      console.error('Error in handleClockIn:', error);
      setError(error.message || 'An error occurred while clocking in');
      
      // Try without location as fallback
      try {
        console.log('Attempting clock in without location as fallback');
        await new Promise((resolve) => {
          clockIn(
            { latitude: undefined, longitude: undefined },
            {
              onSuccess: (data) => {
                console.log('Fallback clock in successful:', data);
                setIsSuccess(true);
                toast({
                  title: "Success",
                  description: "You have successfully clocked in (without location).",
                });
                
                // Reset success state after a delay
                setTimeout(() => {
                  setIsSuccess(false);
                }, 3000);
                
                resolve(data);
              },
              onError: (err) => {
                console.error('Fallback clock in error:', err);
                setError(err.message || 'Failed to clock in');
                toast({
                  title: "Error",
                  description: err.message || 'Failed to clock in',
                  variant: "destructive",
                });
                resolve(null);
              }
            }
          );
        });
      } catch (fallbackError: any) {
        console.error('Fallback clock in attempt failed:', fallbackError);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Circular Clock In Button with Layers and Animations */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Outer Ripple Animation Layer */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-beacon scale-110" style={{ zIndex: -1 }}></div>
        
        {/* Middle Glow Layer */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 animate-pulse-glow scale-105" style={{ zIndex: -1 }}></div>
        
        {/* Inner Button Container */}
        <div className="relative" style={{ zIndex: 20 }}>
          <Button
            onClick={handleClockIn}
            disabled={isClockingIn || isProcessing || !!currentTimeLog}
            className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 
                       hover:from-primary/90 hover:via-primary/80 hover:to-primary/70
                       text-white shadow-strong hover:shadow-primary
                       transition-all duration-500 transform hover:scale-105 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed
                       border-4 border-white/20 backdrop-blur-sm
                       animate-float"
            style={{
              background: (isClockingIn || isProcessing)
                ? 'linear-gradient(135deg, #0FA0CE 0%, #ff1c04 50%, #0FA0CE 100%)'
                : 'linear-gradient(135deg, #ff1c04 0%, #ff4444 50%, #ff1c04 100%)',
              animation: (isClockingIn || isProcessing)
                ? 'pulse-glow 1s ease-in-out infinite, float 3s ease-in-out infinite'
                : 'float 3s ease-in-out infinite',
              cursor: (isClockingIn || isProcessing || !!currentTimeLog) ? 'not-allowed' : 'pointer'
            }}
          >
            {/* Inner Content with Icon and Ripple Effect */}
            <div className="relative flex flex-col items-center justify-center space-y-1">
              {/* Ripple Effect on Click */}
              {isClockingIn && (
                <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
              )}
              
              {/* Clock Icon with Rotation Animation */}
              <Clock 
                className={`h-8 w-8 ${isClockingIn ? 'animate-spin' : 'animate-bounce-soft'}`} 
              />
              
              {/* Text */}
              <span className="text-xs font-semibold text-center leading-tight">
                {isClockingIn || isProcessing
                  ? 'Clocking...' 
                  : currentTimeLog 
                    ? 'Clocked In' 
                    : 'Clock In'
                }
              </span>
            </div>
            
            {/* Shimmer Effect Overlay */}
            <div className="absolute inset-0 rounded-full overflow-hidden" style={{ pointerEvents: 'none' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              transform -translate-x-full animate-shimmer" style={{ pointerEvents: 'none' }}></div>
            </div>
          </Button>
        </div>
        
        {/* Rotating Border Animation */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40 animate-spin" 
             style={{ animationDuration: '3s', zIndex: -2, pointerEvents: 'none' }}></div>
      </div>

      {/* Status and Location Information */}
      <div className="text-center space-y-2">
        {error && (
          <div className="text-sm text-red-600 font-medium bg-red-100 dark:bg-red-900/20 
                          rounded-full px-4 py-2 border border-red-200 dark:border-red-800 
                          animate-fade-in">
            ⚠️ {error}
          </div>
        )}
        
        {location && (
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground 
                          bg-black/10 dark:bg-white/5 backdrop-blur-lg rounded-full px-4 py-2 
                          border border-primary/20 animate-fade-in">
            <MapPin className="h-4 w-4 text-primary animate-pulse" />
            <span>
              Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
          </div>
        )}

        {currentTimeLog && (
          <div className="text-sm text-green-600 font-medium bg-green-100 dark:bg-green-900/20 
                          rounded-full px-4 py-2 border border-green-200 dark:border-green-800 
                          animate-fade-in">
            ✓ Clocked in at {new Date(currentTimeLog.clock_in).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Instruction Text */}
      <p className="text-xs sm:text-sm text-muted-foreground animate-fade-in delay-200 text-center max-w-sm">
        {currentTimeLog 
          ? "You're currently clocked in. Tap to continue to dashboard." 
          : "Tap the button to clock in with your location and proceed to login"
        }
      </p>
    </div>
  );
};
