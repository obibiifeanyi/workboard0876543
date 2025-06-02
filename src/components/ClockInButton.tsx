
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useAuth } from "@/hooks/useAuth";

export const ClockInButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clockIn, isClockingIn, getCurrentTimeLog } = useTimeTracking();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const coords = await getLocation();
      clockIn(coords);
      
      // Redirect based on user role after successful clock in
      // This will be handled by the clockIn success callback
    } catch (error) {
      console.error('Error getting location:', error);
      // Clock in without location if geolocation fails
      clockIn({});
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={handleClockIn}
        disabled={isClockingIn || !!currentTimeLog}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 
                   hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 
                   rounded-2xl text-lg font-semibold shadow-lg transition-all 
                   duration-300 transform hover:scale-105 disabled:opacity-50 
                   disabled:cursor-not-allowed"
      >
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6" />
          <span>
            {isClockingIn 
              ? 'Clocking In...' 
              : currentTimeLog 
                ? 'Already Clocked In' 
                : 'Clock In'
            }
          </span>
        </div>
      </Button>

      {location && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </span>
        </div>
      )}

      {currentTimeLog && (
        <div className="text-sm text-green-600 font-medium">
          Clocked in at {new Date(currentTimeLog.clock_in).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
