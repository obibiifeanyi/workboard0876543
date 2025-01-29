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
      {/* Enhanced animated layers with new color */}
      <div className="absolute inset-0 animate-pulse-beacon opacity-40 rounded-full bg-[#ff1c04] scale-110" />
      <div className="absolute inset-0 animate-pulse-beacon opacity-30 rounded-full bg-[#ff1c04] scale-125 delay-75" />
      <div className="absolute inset-0 animate-pulse-beacon opacity-20 rounded-full bg-[#ff1c04] scale-150 delay-150" />
      <div className="absolute inset-0 animate-pulse-beacon opacity-15 rounded-full bg-[#ff1c04] scale-[1.75] delay-200" />
      <div className="absolute inset-0 animate-pulse-beacon opacity-10 rounded-full bg-[#ff1c04] scale-[2] delay-300" />
      <div className="absolute inset-0 animate-pulse-beacon opacity-5 rounded-full bg-[#ff1c04] scale-[2.25] delay-400" />
      
      <Button
        onClick={handleClockIn}
        disabled={loading}
        className="w-40 h-40 rounded-full 
          bg-gradient-to-br from-[#ff1c04] via-[#ff1c04]/90 to-[#ff1c04]/80
          hover:bg-[#ff1c04]/90 text-white
          shadow-[0_0_30px_rgba(255,28,4,0.3),
                  0_0_60px_rgba(255,28,4,0.2),
                  0_0_90px_rgba(255,28,4,0.1),
                  inset_0_0_20px_rgba(255,255,255,0.1)]
          hover:shadow-[0_0_35px_rgba(255,28,4,0.4),
                       0_0_70px_rgba(255,28,4,0.3),
                       0_0_105px_rgba(255,28,4,0.2),
                       inset_0_0_25px_rgba(255,255,255,0.2)]
          active:shadow-[0_0_25px_rgba(255,28,4,0.3),
                        0_0_50px_rgba(255,28,4,0.2),
                        0_0_75px_rgba(255,28,4,0.1),
                        inset_0_0_15px_rgba(255,255,255,0.1)]
          active:transform active:scale-95
          transition-all duration-300 ease-in-out
          border-2 border-[#ff1c04]/20
          backdrop-blur-sm
          relative
          before:content-['']
          before:absolute before:inset-1
          before:rounded-full
          before:bg-gradient-to-b
          before:from-white/10 before:to-transparent
          before:opacity-50
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
  );
};