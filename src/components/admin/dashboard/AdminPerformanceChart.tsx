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

const formatNaira = (value: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const AdminPerformanceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Performance Overview
          <span className="ml-2 text-sm text-primary">+25.37%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNaira(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatNaira(value), 'Amount']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#ff1c04" 
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