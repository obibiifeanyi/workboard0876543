import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", performance: 85 },
  { name: "Tue", performance: 92 },
  { name: "Wed", performance: 78 },
  { name: "Thu", performance: 95 },
  { name: "Fri", performance: 89 },
  { name: "Sat", performance: 70 },
  { name: "Sun", performance: 72 },
];

export const AdminPerformanceChart = () => {
  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Weekly Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/20" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
              />
              <YAxis 
                className="text-xs"
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px",
                }}
                formatter={(value: number) => [`${value}%`, "Performance"]}
              />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="#003399" 
                strokeWidth={2}
                dot={{ fill: "#003399" }}
                activeDot={{ r: 8, fill: "#ff1c04" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};