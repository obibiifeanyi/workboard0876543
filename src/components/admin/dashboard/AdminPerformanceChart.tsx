import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mar 15', value: 2400 },
  { name: 'Mar 20', value: 3600 },
  { name: 'Mar 25', value: 3200 },
  { name: 'Mar 30', value: 4500 },
  { name: 'Apr 5', value: 4200 },
  { name: 'Apr 10', value: 5200 },
  { name: 'Apr 15', value: 5800 },
];

export const AdminPerformanceChart = () => {
  return (
    <Card className="bg-[#1a1a1a] border-none shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Performance Overview
          <span className="ml-2 text-sm text-[#86efac]">+25.37%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke="#666" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#86efac" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};