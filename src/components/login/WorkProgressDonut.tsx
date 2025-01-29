import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Active Work', value: 420, color: '#003399' },  // Using our system blue color
  { name: 'Meetings', value: 120, color: '#00A3FF' },
  { name: 'Breaks', value: 60, color: '#66B2FF' },
  { name: 'Other Activities', value: 60, color: '#B3D9FF' },
];

export const WorkProgressDonut = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Daily Progress</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total Time: {hours}h {minutes}m
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => {
                  const hrs = Math.floor(value / 60);
                  const mins = value % 60;
                  return [`${hrs}h ${mins}m`, 'Time'];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};