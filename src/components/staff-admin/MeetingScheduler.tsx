import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, MapPin } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];
  status: "upcoming" | "completed" | "cancelled";
}

const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Weekly Team Sync",
    date: "2024-06-15",
    time: "10:00 AM",
    location: "Conference Room A",
    attendees: ["John Doe", "Jane Smith", "Peter Jones"],
    status: "upcoming",
  },
  {
    id: "2",
    title: "Project Review",
    date: "2024-06-16",
    time: "2:00 PM",
    location: "Virtual Meeting",
    attendees: ["Team Leads", "Project Managers"],
    status: "upcoming",
  },
  {
    id: "3",
    title: "Training Session",
    date: "2024-06-14",
    time: "11:00 AM",
    location: "Training Room",
    attendees: ["New Staff", "HR Team"],
    status: "completed",
  },
];

export const MeetingScheduler = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Meeting Scheduler</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMeetings
                .filter(meeting => meeting.status === "upcoming")
                .map(meeting => (
                  <div key={meeting.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {meeting.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {meeting.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {meeting.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        {meeting.attendees.join(", ")}
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-600">Cancel</Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Schedule New Meeting</CardTitle>
            <Button><Calendar className="mr-2 h-4 w-4" /> New Meeting</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meeting Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter meeting title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter meeting location"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Attendees</label>
                  <select
                    multiple
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="1">John Doe</option>
                    <option value="2">Jane Smith</option>
                    <option value="3">Peter Jones</option>
                  </select>
                </div>
              </div>
              <Button className="w-full">Schedule Meeting</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 