import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Active Work", value: 240 },
  { name: "Meetings", value: 120 },
  { name: "Breaks", value: 60 },
  { name: "Other Activities", value: 80 },
];

const COLORS = ["#ff1c04", "#0FA0CE", "#003399", "#33C3F0"];

export const WorkProgressDonut = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Work Progress</CardTitle>
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
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="stroke-background hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value} minutes`}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '8px',
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 text-center">
            <p className="text-sm text-muted-foreground">
              Total Time: {total} minutes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};