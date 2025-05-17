import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  isLoading?: boolean;
  formatAsCurrency?: boolean;
  isTextValue?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  isLoading = false,
  formatAsCurrency = false,
  isTextValue = false
}) => {
  // Format the display value
  const displayValue = formatAsCurrency && typeof value === 'number'
    ? formatCurrency(value)
    : value;
  
  // Format the trend percentage
  const trendDisplay = trend ? `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%` : null;
  
  // Determine the trend color
  const trendColor = trend 
    ? trend > 0 
      ? 'text-green-400' 
      : 'text-red-400'
    : '';
  
  // Determine the icon color based on title
  const getIconColor = () => {
    if (title.includes('Revenue') || title.includes('Profit')) return 'bg-green-900/20 text-green-400';
    if (title.includes('Loss')) return 'bg-red-900/20 text-red-400';
    if (title.includes('Trade')) return 'bg-purple-900/20 text-purple-400';
    return 'bg-blue-900/20 text-blue-400';
  };
  
  return (
    <Card className="p-5 shadow-lg border border-border">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-muted-foreground text-sm">{title}</h3>
          {isLoading ? (
            <div className="mt-1">
              <Skeleton className="h-8 w-28" />
            </div>
          ) : (
            <div className="flex items-baseline mt-1">
              <p className={cn("text-2xl font-semibold", isTextValue ? "" : "font-mono")}>
                {displayValue}
              </p>
              {trendDisplay && (
                <span className={cn('ml-2 text-xs font-medium', trendColor)}>
                  {trendDisplay}
                </span>
              )}
            </div>
          )}
        </div>
        <div className={cn('p-2 rounded-lg', getIconColor())}>
          {React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5' })}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
