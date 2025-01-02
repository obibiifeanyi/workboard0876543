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
    <Button
      onClick={handleClockIn}
      disabled={loading}
      className="w-32 h-32 rounded-full 
        bg-gradient-to-br from-primary via-primary/90 to-primary/80
        hover:bg-primary/90 text-white
        shadow-[0_0_20px_rgba(234,56,76,0.3),
                0_0_40px_rgba(234,56,76,0.2),
                0_0_60px_rgba(234,56,76,0.1),
                inset_0_0_15px_rgba(255,255,255,0.1)]
        hover:shadow-[0_0_25px_rgba(234,56,76,0.4),
                     0_0_50px_rgba(234,56,76,0.3),
                     0_0_75px_rgba(234,56,76,0.2),
                     inset_0_0_20px_rgba(255,255,255,0.2)]
        active:shadow-[0_0_15px_rgba(234,56,76,0.3),
                      0_0_30px_rgba(234,56,76,0.2),
                      0_0_45px_rgba(234,56,76,0.1),
                      inset_0_0_10px_rgba(255,255,255,0.1)]
        active:transform active:scale-95
        transition-all duration-300 ease-in-out
        border-2 border-primary/20
        backdrop-blur-sm
        relative
        before:content-['']
        before:absolute before:inset-1
        before:rounded-full
        before:bg-gradient-to-b
        before:from-white/10 before:to-transparent
        before:opacity-50
        flex flex-col items-center justify-center gap-2
        group"
    >
      <Timer className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
      <span className="font-semibold tracking-wide">
        {loading ? "Processing..." : "Clock In"}
      </span>
    </Button>
  );
};