import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TIME_RANGES } from '@/lib/constants';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PerformanceChartProps {
  selectedTimeRange: string;
  onTimeRangeChange: (range: string) => void;
}

// Generate sample performance data based on the time range
const generateChartData = (range: string) => {
  const now = new Date();
  const data = [];
  let numPoints = 0;
  let interval = 0;
  
  switch (range) {
    case '1D':
      numPoints = 24;
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case '1W':
      numPoints = 7;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '1M':
      numPoints = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case 'ALL':
      numPoints = 12;
      interval = 30 * 24 * 60 * 60 * 1000; // 1 month
      break;
  }
  
  let previousProfit = 10000 + Math.random() * 5000;
  
  for (let i = numPoints - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * interval));
    
    // Generate random but slightly trending profit data
    const changePercent = Math.random() * 0.2 - 0.05; // -5% to +15% change
    const profit = previousProfit * (1 + changePercent);
    previousProfit = profit;
    
    let label;
    switch (range) {
      case '1D':
        label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        break;
      case '1W':
      case '1M':
        label = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        break;
      case 'ALL':
        label = date.toLocaleDateString([], { month: 'short', year: '2-digit' });
        break;
    }
    
    data.push({
      date: label,
      profit: profit.toFixed(2),
      timestamp: date.getTime(),
    });
  }
  
  return data;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-3 border border-border rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-primary font-mono">
          {formatCurrency(Number(payload[0].value))}
        </p>
      </div>
    );
  }

  return null;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  selectedTimeRange, 
  onTimeRangeChange 
}) => {
  const { isConnected, isCorrectNetwork } = useWallet();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading chart data
    setLoading(true);
    
    const timer = setTimeout(() => {
      const data = generateChartData(selectedTimeRange);
      setChartData(data);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [selectedTimeRange]);
  
  if (!isConnected || !isCorrectNetwork) {
    return (
      <Card className="rounded-xl shadow-lg border border-border overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Performance History</h3>
          </div>
          
          <div className="h-64 w-full flex items-center justify-center bg-background/30 rounded-lg">
            <div className="text-center p-6">
              <p className="text-muted-foreground mb-4">Connect your wallet to view performance data</p>
              <Button variant="outline" size="sm" disabled>Connect Wallet</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="rounded-xl shadow-lg border border-border overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Performance History</h3>
          
          <div className="flex space-x-2">
            {TIME_RANGES.map((range) => (
              <Button
                key={range.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs font-medium px-3 py-1",
                  selectedTimeRange === range.id ? "bg-primary/20 text-primary" : ""
                )}
                onClick={() => onTimeRangeChange(range.id)}
              >
                {range.id}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-64 w-full relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date"
                  tick={{ fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#4B5563' }}
                  axisLine={{ stroke: '#4B5563' }}
                />
                <YAxis 
                  tick={{ fill: '#9CA3AF' }}
                  tickLine={{ stroke: '#4B5563' }}
                  axisLine={{ stroke: '#4B5563' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#6366F1', stroke: '#6366F1' }}
                  activeDot={{ r: 5, fill: '#6366F1', stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
