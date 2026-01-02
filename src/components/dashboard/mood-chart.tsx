'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Area, AreaChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', mood: 186 },
  { month: 'February', mood: 305 },
  { month: 'March', mood: 237 },
  { month: 'April', mood: 203 },
  { month: 'May', mood: 209 },
  { month: 'June', mood: 214 },
];

const chartConfig = {
  mood: {
    label: 'Avg. Mood Score',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function MoodChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 10,
          right: 10,
          left: -10,
          bottom: 10,
        }}
      >
        <defs>
          <linearGradient id="fillMood" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-mood)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-mood)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => value.slice(0, 3)}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <ChartTooltip cursor={{stroke: 'hsl(var(--accent))', strokeWidth: 2, strokeDasharray: "3 3"}} content={<ChartTooltipContent />} />
        <Area
          dataKey="mood"
          type="monotone"
          fill="url(#fillMood)"
          stroke="var(--color-mood)"
          strokeWidth={3}
          dot={{
            r: 6,
            fill: "var(--color-mood)",
            strokeWidth: 2,
            stroke: "hsl(var(--background))",
          }}
          activeDot={{
            r: 8,
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
