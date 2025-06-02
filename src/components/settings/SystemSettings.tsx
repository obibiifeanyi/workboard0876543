
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings, Palette, Globe, Save } from "lucide-react";

export const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    theme: 'system',
    language: 'en',
    timezone: 'Africa/Lagos',
    enableAnimations: true,
    autoSave: true,
    compactMode: false
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    
    // Apply theme if changed
    if (settings.theme !== 'system') {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    }
    
    toast({
      title: "Success",
      description: "System settings saved successfully.",
    });
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Settings className="h-5 w-5 text-primary" />
          System Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Theme Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Language
            </Label>
            <Select
              value={settings.language}
              onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="yo">Yoruba</SelectItem>
                <SelectItem value="ig">Igbo</SelectItem>
                <SelectItem value="ha">Hausa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timezone Selection */}
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Lagos">West Africa Time (Lagos)</SelectItem>
                <SelectItem value="Africa/Abuja">West Africa Time (Abuja)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enable Animations */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Animations</Label>
              <p className="text-sm text-muted-foreground">
                Enable smooth animations and transitions
              </p>
            </div>
            <Switch
              checked={settings.enableAnimations}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, enableAnimations: checked }))
              }
            />
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto Save</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save changes as you type
              </p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, autoSave: checked }))
              }
            />
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use a more compact interface layout
              </p>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, compactMode: checked }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
