import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Lock, Globe, Database, Shield } from "lucide-react";

interface SettingSection {
  title: string;
  description: string;
  icon: React.ElementType;
  settings: {
    name: string;
    description: string;
    enabled: boolean;
  }[];
}

const settingSections: SettingSection[] = [
  {
    title: "Notifications",
    description: "Configure system-wide notification settings",
    icon: Bell,
    settings: [
      {
        name: "Email Notifications",
        description: "Send notifications via email",
        enabled: true,
      },
      {
        name: "Push Notifications",
        description: "Send push notifications to mobile devices",
        enabled: true,
      },
      {
        name: "SMS Notifications",
        description: "Send notifications via SMS",
        enabled: false,
      },
    ],
  },
  {
    title: "Security",
    description: "Manage security and access control settings",
    icon: Lock,
    settings: [
      {
        name: "Two-Factor Authentication",
        description: "Require 2FA for all users",
        enabled: true,
      },
      {
        name: "Session Timeout",
        description: "Automatically log out inactive users",
        enabled: true,
      },
      {
        name: "IP Restrictions",
        description: "Restrict access to specific IP addresses",
        enabled: false,
      },
    ],
  },
  {
    title: "System",
    description: "Configure system-wide settings",
    icon: Settings,
    settings: [
      {
        name: "Maintenance Mode",
        description: "Enable maintenance mode",
        enabled: false,
      },
      {
        name: "Debug Mode",
        description: "Enable debug logging",
        enabled: false,
      },
      {
        name: "Auto Updates",
        description: "Automatically install system updates",
        enabled: true,
      },
    ],
  },
];

export const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">System Settings</h2>
      
      <div className="grid gap-6">
        {settingSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <section.icon className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div
                    key={setting.name}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {setting.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={(checked) => {
                        // Handle setting change
                        console.log(`${setting.name} changed to ${checked}`);
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}; 