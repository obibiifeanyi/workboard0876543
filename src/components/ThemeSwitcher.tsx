import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const [showThemeDialog, setShowThemeDialog] = useState(false);

  useEffect(() => {
    // Show the dialog only once when the component mounts
    const hasSeenThemeDialog = localStorage.getItem('hasSeenThemeDialog');
    if (!hasSeenThemeDialog) {
      setShowThemeDialog(true);
      localStorage.setItem('hasSeenThemeDialog', 'true');
    }
  }, []);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full 
                bg-background/50 backdrop-blur-sm
                border border-border/50
                hover:bg-accent
                transition-all duration-300
                shadow-lg hover:shadow-accent/25
                dark:hover:shadow-accent/10
                animate-pulse-beacon"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 
                dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300
                dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showThemeDialog} onOpenChange={setShowThemeDialog}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle>Theme Preference</DialogTitle>
            <DialogDescription>
              Try our dark mode for a more comfortable viewing experience! 
              Click the theme switcher button in the top-right corner to toggle between light and dark modes.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};