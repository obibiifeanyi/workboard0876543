
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Timer } from "lucide-react";

export const ClockInButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleClockIn = async () => {
    setLoading(true);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Location:", { latitude, longitude });
            toast({
              title: "Clock In Successful",
              description: "Your location has been recorded.",
            });
            navigate("/login");
          },
          (error) => {
            console.error("Error getting location:", error);
            toast({
              title: "Location Error",
              description: "Please enable location services to clock in.",
              variant: "destructive",
            });
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
    <div className="relative">
      <div className="loader">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="box"
            style={{
              '--size': '250px',
              '--duration': '3s',
              '--background': `linear-gradient(0deg, rgba(255, 255, 255, ${(6-index) * 0.05}) 0%, rgba(255, 255, 255, ${(6-index) * 0.1}) 100%)`,
              inset: `${(index - 1) * 10}%`,
              zIndex: 99 - index,
              borderColor: `rgba(255, 255, 255, ${1 - (index - 1) * 0.2})`,
              animationDelay: `${(index - 1) * 0.2}s`,
              position: 'absolute',
              borderRadius: '50%',
              borderTop: '1px solid',
              boxShadow: 'rgba(255, 255, 255, 0.3) 0px 10px 10px -0px',
              backdropFilter: 'blur(5px)',
              animation: 'ripple var(--duration) infinite ease-in-out'
            } as React.CSSProperties}
          />
        ))}
        <div className="absolute inset-0 grid place-content-center" style={{ padding: '30%', zIndex: 100 }}>
          <div className="relative w-24 h-24 rounded-full bg-red-600 p-2 shadow-lg">
            <img 
              src="/lovable-uploads/491c7e61-a4fb-46a3-a002-904b84354e48.png"
              alt="CT Communication Towers Logo"
              className="w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
            <Button
              onClick={handleClockIn}
              disabled={loading}
              className="w-full h-full rounded-full 
                bg-gradient-to-br from-white via-white/90 to-white/80
                hover:bg-white/90 text-red-600
                shadow-[0_0_30px_rgba(255,255,255,0.3)]
                hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]
                active:shadow-[0_0_25px_rgba(255,255,255,0.3)]
                active:transform active:scale-95
                transition-all duration-300 ease-in-out
                border-2 border-white/20
                backdrop-blur-sm
                relative
                flex flex-col items-center justify-center gap-2
                group
                z-10"
            >
              <Timer className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold tracking-wide text-xs">
                {loading ? "Processing..." : "Clock In"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
