'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { stressor: 'Academics', count: 450 },
  { stressor: 'Social', count: 320 },
  { stressor: 'Financial', count: 280 },
  { stressor: 'Family', count: 210 },
  { stressor: 'Future', count: 180 },
];

const chartConfig = {
  count: {
    label: 'Reports',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function StressorsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart 
        accessibilityLayer 
        data={chartData} 
        layout="vertical" 
        margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
        barGap={10}
        barSize={20}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
        <YAxis
          dataKey="stressor"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={80}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <XAxis type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[10, 10, 10, 10]} />
      </BarChart>
    </ChartContainer>
  );
}
