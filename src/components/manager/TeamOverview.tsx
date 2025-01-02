import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin } from "lucide-react";

const mockTeamMembers = [
  {
    id: 1,
    name: "John Doe",
    role: "Senior Developer",
    avatar: "/placeholder.svg",
    status: "Online",
    location: "Main Office",
    lastClockIn: "09:00 AM",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Designer",
    avatar: "/placeholder.svg",
    status: "Away",
    location: "Remote",
    lastClockIn: "08:45 AM",
  },
];

export const TeamOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Team Overview</h2>
        <p className="text-muted-foreground">Monitor your team's activity and status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockTeamMembers.map((member) => (
          <Card key={member.id} className="bg-black/10 border-none shadow-lg rounded-2xl hover:bg-black/20 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-medium">{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    member.status === "Online" 
                      ? "bg-green-500" 
                      : "bg-yellow-500"
                  }`} />
                  {member.status}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Last clock-in: {member.lastClockIn}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {member.location}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};