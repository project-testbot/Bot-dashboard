import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Bot } from 'lucide-react';
import { BOT_STATUS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { getBotStatus } from '@/lib/ethers';
import { shortenAddress } from '@/lib/utils';

const Header: React.FC = () => {
  const { 
    isConnected, 
    account, 
    connectWallet, 
    disconnectWallet,
    connecting,
    isCorrectNetwork,
    switchNetwork
  } = useWallet();
  
  // Query the bot status
  const { data: botStatus, isLoading } = useQuery({
    queryKey: ['botStatus'],
    queryFn: getBotStatus,
    enabled: isConnected && isCorrectNetwork,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  // Get bot status display data
  const statusData = botStatus?.status !== undefined
    ? BOT_STATUS[botStatus.status as keyof typeof BOT_STATUS]
    : { name: 'Unknown', color: 'gray' };
  
  // Status indicator color mapping
  const statusColorMap: Record<string, string> = {
    'green': 'bg-green-500',
    'red': 'bg-red-500',
    'yellow': 'bg-yellow-500',
    'blue': 'bg-blue-500',
    'purple': 'bg-purple-500',
    'gray': 'bg-gray-500'
  };
  
  const animationClass = statusData.name === 'Running' ? 'animate-pulse' : '';
  const statusColor = statusColorMap[statusData.color] || 'bg-gray-500';
  
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-foreground flex items-center">
            <Bot className="text-primary mr-3 h-6 w-6" />
            <span>CrashSafe</span>
            <span className="text-primary ml-2">Arbitrage Bot</span>
          </div>
          
          {/* Bot status indicator */}
          {isConnected && isCorrectNetwork ? (
            isLoading ? (
              <Skeleton className="h-7 w-24 rounded-full" />
            ) : (
              <div className="flex items-center bg-background rounded-full px-3 py-1 text-sm">
                <span className={`h-2 w-2 rounded-full ${statusColor} ${animationClass} mr-2`}></span>
                <span>{statusData.name}</span>
              </div>
            )
          ) : null}
        </div>
        
        {/* Network and wallet */}
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-200">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-info mr-2"></span>
              <span>Sepolia Testnet</span>
            </div>
          </div>
          
          {isConnected ? (
            <div className="flex space-x-2">
              {!isCorrectNetwork && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={switchNetwork}
                >
                  Switch Network
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
              >
                {shortenAddress(account)}
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              onClick={connectWallet}
              disabled={connecting}
              className="flex items-center space-x-2"
            >
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
