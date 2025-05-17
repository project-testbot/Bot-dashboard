import React from 'react';
import { formatEtherValue, formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { icons } from 'lucide-react';

interface TokenBalanceCardProps {
  token: string;
  name: string;
  balance: bigint;
  decimals: number;
  isLoading?: boolean;
  iconType: 'ethereum' | 'dollar' | 'coin';
  ethPrice: number;
}

const TokenBalanceCard: React.FC<TokenBalanceCardProps> = ({
  token,
  name,
  balance,
  decimals,
  isLoading = false,
  iconType,
  ethPrice
}) => {
  // Format the displayed balance based on decimals
  const formatBalance = () => {
    if (decimals === 18) {
      return formatEtherValue(balance, 3); // ETH-like token
    } else if (decimals === 6) {
      return (Number(balance) / 10**6).toFixed(2); // USDC-like token
    }
    return (Number(balance) / 10**decimals).toFixed(2);
  };
  
  // Calculate value in USD
  const calculateValue = () => {
    let value;
    if (decimals === 18) {
      value = Number(formatEtherValue(balance, 6)) * ethPrice;
    } else if (decimals === 6) {
      value = Number(balance) / 10**6 * ethPrice;
    } else {
      value = Number(balance) / 10**decimals * ethPrice;
    }
    return formatCurrency(value);
  };
  
  // Get the appropriate icon
  const getIcon = () => {
    switch (iconType) {
      case 'ethereum':
        return <icons.CircleDollarSign className="h-5 w-5 text-blue-300" />;
      case 'dollar':
        return <icons.DollarSign className="h-5 w-5 text-green-300" />;
      case 'coin':
      default:
        return <icons.Coins className="h-5 w-5 text-yellow-300" />;
    }
  };
  
  // Get the background color for the icon container
  const getIconBgColor = () => {
    switch (iconType) {
      case 'ethereum':
        return 'bg-blue-900/30';
      case 'dollar':
        return 'bg-green-900/30';
      case 'coin':
      default:
        return 'bg-yellow-900/30';
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
      <div className="flex items-center">
        <div className={`${getIconBgColor()} p-2 rounded-full`}>
          {getIcon()}
        </div>
        <div className="ml-3">
          <h4 className="font-medium">{token}</h4>
          <p className="text-muted-foreground text-sm">{name}</p>
        </div>
      </div>
      <div className="text-right">
        {isLoading ? (
          <>
            <Skeleton className="h-5 w-24 ml-auto" />
            <Skeleton className="h-4 w-16 ml-auto mt-1" />
          </>
        ) : (
          <>
            <p className="font-mono font-semibold">{formatBalance()} {token}</p>
            <p className="text-muted-foreground text-sm">{calculateValue()}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenBalanceCard;
