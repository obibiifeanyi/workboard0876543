
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Users } from "lucide-react";
import { useManagerData } from "@/hooks/manager/useManagerData";
import { Badge } from "@/components/ui/badge";

export const TeamOverview = () => {
  const { teamMembers, isLoadingTeam } = useManagerData();

  if (isLoadingTeam) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Team Overview</h2>
          <p className="text-muted-foreground">Monitor your team's activity and status</p>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Overview</h2>
          <p className="text-muted-foreground">Monitor your team's activity and status</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="text-lg font-semibold">{teamMembers?.length || 0} Members</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers && teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <Card key={member.id} className="bg-black/10 border-none shadow-lg rounded-2xl hover:bg-black/20 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar_url || ''} alt={member.full_name || ''} />
                    <AvatarFallback>
                      {member.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-medium">{member.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge variant="outline">{member.role}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {member.email}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Joined: {new Date(member.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No team members found
          </div>
        )}
      </div>
    </div>
  );
};
