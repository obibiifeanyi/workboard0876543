import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Target, AlertCircle, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    start_date?: string;
    end_date?: string;
    budget?: number;
    manager_id?: string;
  };
}

interface ProjectWithSites {
  id: string;
  name: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  role: string;
  sites?: Array<{
    id: string;
    name: string;
    location: string;
  }>;
}

export const ProjectTracking = () => {
  const navigate = useNavigate();
  
  const { data: userProjects, isLoading } = useQuery({
    queryKey: ["userProjects"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log('Fetching user projects for:', user.id);

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
            end_date,
            budget,
            manager_id
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      // Filter out any records where projects is null and fetch related sites
      const validProjects = (data || []).filter(item => item.projects) as ProjectMember[];
      
      // Fetch construction sites for each project
      const projectsWithSites: ProjectWithSites[] = await Promise.all(
        validProjects.map(async (projectMember) => {
          const { data: sites } = await supabase
            .from('construction_sites')
            .select('id, site_name, location')
            .eq('project_id', projectMember.project_id);

          // Map site_name to name to match the interface
          const mappedSites = (sites || []).map(site => ({
            id: site.id,
            name: site.site_name,
            location: site.location
          }));

          return {
            ...projectMember.projects,
            role: projectMember.role,
            sites: mappedSites,
          };
        })
      );

      console.log('Projects with sites fetched:', projectsWithSites);
      return projectsWithSites;
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "manager": return "bg-purple-100 text-purple-800";
      case "lead": return "bg-blue-100 text-blue-800";
      case "member": return "bg-green-100 text-green-800";
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/staff/projects/${projectId}`);
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
          My Projects ({userProjects?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {userProjects && userProjects.length > 0 ? (
              userProjects.map((project) => (
                <div key={project.id} className="glass-card p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{project.name}</h3>
                      <Badge className={getRoleColor(project.role)}>
                        {project.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 ${getStatusColor(project.status || "planning")}`}>
                        <AlertCircle className="h-4 w-4" />
                        {project.status || "planning"}
                      </span>
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.description}
                    </p>
                  )}
                  
                  <Progress 
                    value={getProgressValue(project.status || "planning")} 
                    className="h-2 mb-3" 
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="font-medium">
                          {getProgressValue(project.status || "planning")}% Complete
                        </span>
                      </div>
                      
                      {project.budget && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-medium">{formatCurrency(project.budget)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Start Date:
                        </span>
                        <span className="font-medium">
                          {project.start_date 
                            ? new Date(project.start_date).toLocaleDateString()
                            : "Not set"
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due Date:
                        </span>
                        <span className="font-medium">
                          {project.end_date 
                            ? new Date(project.end_date).toLocaleDateString()
                            : "Not set"
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {project.sites && project.sites.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Project Sites ({project.sites.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {project.sites.slice(0, 4).map((site) => (
                          <div key={site.id} className="text-xs bg-muted p-2 rounded">
                            <div className="font-medium">{site.name}</div>
                            <div className="text-muted-foreground">{site.location}</div>
                          </div>
                        ))}
                        {project.sites.length > 4 && (
                          <div className="text-xs text-muted-foreground p-2">
                            +{project.sites.length - 4} more sites
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-[30px]"
                      onClick={() => handleViewProject(project.id)}
                    >
                      View Project Details
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No projects assigned yet</p>
                <p className="text-sm">You'll see your assigned projects here once they're created.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
