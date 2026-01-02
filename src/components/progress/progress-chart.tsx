
'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent
} from '@/components/ui/chart';
import { useI18n } from '@/contexts/i18n';

type ChartData = {
  name: string;
  phq9: number;
  gad7: number;
}[];

const chartConfig = {
  phq9: {
    label: 'PHQ-9 (Depression)',
    color: 'hsl(var(--chart-1))',
  },
  gad7: {
    label: 'GAD-7 (Anxiety)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ProgressChart({ data }: { data: ChartData }) {
  const { t } = useI18n();
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 27]}
        />
        <Tooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
            />
          }
        />
        <Legend content={<ChartLegendContent />} />
        <defs>
          <linearGradient id="fillPhq9" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-phq9)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-phq9)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillGad7" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-gad7)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-gad7)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="phq9"
          type="natural"
          fill="url(#fillPhq9)"
          stroke="var(--color-phq9)"
          stackId="a"
        />
        <Area
          dataKey="gad7"
          type="natural"
          fill="url(#fillGad7)"
          stroke="var(--color-gad7)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
