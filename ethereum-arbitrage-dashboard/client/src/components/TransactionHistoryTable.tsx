import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

interface Transaction {
  id: string;
  date: Date;
  type: string;
  amount: number;
  gasUsed: number;
  status: 'Success' | 'Failed' | 'Pending';
}

// Generate some sample transactions for demo (in real app this would come from contract events)
const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  for (let i = 0; i < 10; i++) {
    const date = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000)); // 2 hours between each
    const success = Math.random() > 0.2; // 80% success rate
    
    transactions.push({
      id: `tx-${i}`,
      date,
      type: 'Arbitrage',
      amount: success ? Math.random() * 200 + 100 : -(Math.random() * 50 + 10),
      gasUsed: Math.floor(Math.random() * 30000) + 230000,
      status: success ? 'Success' : 'Failed'
    });
  }
  
  return transactions;
};

const TransactionHistoryTable: React.FC = () => {
  const { isConnected, isCorrectNetwork } = useWallet();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Simulate loading transactions
  React.useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      const timer = setTimeout(() => {
        setTransactions(generateTransactions());
        setLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, isCorrectNetwork]);
  
  // Format the date
  const formatDate = (date: Date): string => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-900/20 text-green-400';
      case 'Failed':
        return 'bg-red-900/20 text-red-400';
      case 'Pending':
        return 'bg-yellow-900/20 text-yellow-400';
      default:
        return 'bg-gray-900/20 text-gray-400';
    }
  };
  
  if (!isConnected || !isCorrectNetwork) {
    return (
      <Card className="rounded-xl shadow-lg border border-border">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Transaction History</h3>
          </div>
          
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Connect your wallet to view transaction history</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="rounded-xl shadow-lg border border-border">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Transaction History</h3>
          <Button variant="link" size="sm" className="text-primary flex items-center">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Gas Used</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono">{formatDate(tx.date)}</td>
                    <td className="px-4 py-3 text-sm">{tx.type}</td>
                    <td className={`px-4 py-3 text-sm font-mono ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">{tx.gasUsed.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 ${getStatusBadge(tx.status)} rounded-full text-xs`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistoryTable;
