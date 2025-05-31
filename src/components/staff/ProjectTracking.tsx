
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Target, AlertCircle } from "lucide-react";

interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  joined_at?: string;
  projects: {
    id: string;
    name: string;
    description?: string;
    status?: string;
    priority?: string;
    start_date?: string;
    end_date?: string;
  };
}

export const ProjectTracking = () => {
  const { data: userProjects, isLoading } = useQuery({
    queryKey: ["userProjects"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("project_members")
        .select(`
          id,
          project_id,
          user_id,
          role,
          joined_at,
          projects (
            id,
            name,
            description,
            status,
            start_date,
            end_date
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      
      // Filter out any records where projects is null
      const validProjects = (data || []).filter(item => item.projects) as ProjectMember[];
      return validProjects;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-500";
      case "planning": return "text-blue-500";
      case "on_hold": return "text-yellow-500";
      case "completed": return "text-purple-500";
      case "cancelled": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case "planning": return 10;
      case "active": return 50;
      case "completed": return 100;
      case "on_hold": return 25;
      case "cancelled": return 0;
      default: return 0;
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Target className="h-5 w-5 text-primary" />
            Project Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Target className="h-5 w-5 text-primary" />
          Project Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {userProjects && userProjects.length > 0 ? (
              userProjects.map((projectMember) => (
                <div key={projectMember.id} className="glass-card p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{projectMember.projects.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 ${getStatusColor(projectMember.projects.status || "planning")}`}>
                        <AlertCircle className="h-4 w-4" />
                        {projectMember.projects.status || "planning"}
                      </span>
                    </div>
                  </div>
                  
                  {projectMember.projects.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {projectMember.projects.description}
                    </p>
                  )}
                  
                  <Progress 
                    value={getProgressValue(projectMember.projects.status || "planning")} 
                    className="h-2 mt-2" 
                  />
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                    <span>
                      {getProgressValue(projectMember.projects.status || "planning")}% Complete
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {projectMember.projects.end_date 
                        ? `Due: ${new Date(projectMember.projects.end_date).toLocaleDateString()}`
                        : "No due date"
                      }
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Role: {projectMember.role}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects assigned yet.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
