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
                bg-white dark:bg-gray-800
                hover:bg-gray-100 dark:hover:bg-gray-700
                border border-gray-200 dark:border-gray-700
                transition-colors duration-200"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showThemeDialog} onOpenChange={setShowThemeDialog}>
        <DialogContent className="sm:max-w-md">
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