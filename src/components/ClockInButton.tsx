
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
              '--size': '300px',
              '--duration': '3s',
              '--background': `linear-gradient(0deg, rgba(255, 28, 4, 0.1) 0%, rgba(255, 28, 4, 0.2) 100%)`,
              inset: `${(index - 1) * 10}%`,
              zIndex: 99 - index,
              borderColor: `rgba(255, 28, 4, ${1 - (index - 1) * 0.2})`,
              animationDelay: `${(index - 1) * 0.2}s`
            } as React.CSSProperties}
          />
        ))}
        <div className="logo">
          <Button
            onClick={handleClockIn}
            disabled={loading}
            className="w-40 h-40 rounded-full 
              bg-gradient-to-br from-[#ff1c04] via-[#ff1c04]/90 to-[#ff1c04]/80
              hover:bg-[#ff1c04]/90 text-white
              shadow-[0_0_30px_rgba(255,28,4,0.3)]
              hover:shadow-[0_0_35px_rgba(255,28,4,0.4)]
              active:shadow-[0_0_25px_rgba(255,28,4,0.3)]
              active:transform active:scale-95
              transition-all duration-300 ease-in-out
              border-2 border-[#ff1c04]/20
              backdrop-blur-sm
              relative
              flex flex-col items-center justify-center gap-2
              group
              z-10"
          >
            <Timer className="h-12 w-12 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold tracking-wide text-lg">
              {loading ? "Processing..." : "Clock In"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
