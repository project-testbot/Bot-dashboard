import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Fuel, 
  Clock, 
  ArrowLeftRight, 
  Hourglass 
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { getTimeAgo } from '@/lib/utils';

interface NetworkStatsProps {
  gasPrice: number;
  diagnostics: {
    chain: string;
    profit: bigint;
    slippage: bigint;
    oracle: boolean;
    error: string;
  } | null | undefined;
  isLoading: boolean;
}

const NetworkStatsItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  isLoading?: boolean;
}> = ({ icon, label, value, isLoading = false }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 text-muted-foreground">
        {React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })}
        <span>{label}</span>
      </div>
      {isLoading ? (
        <Skeleton className="h-5 w-20" />
      ) : (
        <div className="font-mono font-medium">{value}</div>
      )}
    </div>
  );
};

const NetworkStats: React.FC<NetworkStatsProps> = ({ 
  gasPrice, 
  diagnostics,
  isLoading 
}) => {
  const { isConnected, isCorrectNetwork } = useWallet();
  
  // Calculate last block time (simulated)
  const [lastBlockTime, setLastBlockTime] = React.useState<string>(getTimeAgo(Date.now() - 24000));
  
  // Simulate block times
  React.useEffect(() => {
    if (!isConnected || !isCorrectNetwork) return;
    
    const intervalId = setInterval(() => {
      // Simulate a new block every 12-15 seconds for Ethereum
      const randomDelay = Math.floor(Math.random() * 3000) + 12000;
      setLastBlockTime(getTimeAgo(Date.now() - randomDelay));
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, [isConnected, isCorrectNetwork]);
  
  // Get slippage tolerance
  const slippageTolerance = diagnostics?.slippage 
    ? `${Number(diagnostics.slippage) / 100}%` 
    : '0.5%';
  
  if (!isConnected || !isCorrectNetwork) {
    return (
      <Card className="rounded-xl shadow-lg border border-border">
        <CardContent className="p-5">
          <h3 className="font-semibold mb-4">Network Statistics</h3>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Connect your wallet to view network stats</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="rounded-xl shadow-lg border border-border">
      <CardContent className="p-5">
        <h3 className="font-semibold mb-4">Network Statistics</h3>
        
        <div className="space-y-3">
          <NetworkStatsItem 
            icon={<Fuel />}
            label="Current Gas Price"
            value={`${gasPrice.toFixed(1)} Gwei`}
            isLoading={isLoading}
          />
          
          <NetworkStatsItem 
            icon={<Clock />}
            label="Last Block Time"
            value={lastBlockTime}
            isLoading={isLoading}
          />
          
          <NetworkStatsItem 
            icon={<ArrowLeftRight />}
            label="Slippage Tolerance"
            value={slippageTolerance}
            isLoading={isLoading}
          />
          
          <NetworkStatsItem 
            icon={<Hourglass />}
            label="Cooldown Period"
            value="5 minutes"
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkStats;
