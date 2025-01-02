import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Users } from "lucide-react";

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
      <h2 className="text-2xl font-bold">Team Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockTeamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    member.status === "Online" 
                      ? "bg-green-500" 
                      : "bg-yellow-500"
                  }`} />
                  {member.status}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Last clock-in: {member.lastClockIn}
                </div>
                <div className="flex items-center text-sm">
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