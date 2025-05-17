import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContractStatus from '@/components/ContractStatus';
import StatsCard from '@/components/StatsCard';
import PerformanceChart from '@/components/PerformanceChart';
import TransactionHistoryTable from '@/components/TransactionHistoryTable';
import TokenBalanceCard from '@/components/TokenBalanceCard';
import BotControlPanel from '@/components/BotControlPanel';
import NetworkStats from '@/components/NetworkStats';
import { getTimeAgo } from '@/lib/utils';
import { useWallet } from '@/contexts/WalletContext';
import { getBotStatus, getContractBalances, getGasPrice, getDiagnostics } from '@/lib/ethers';
import { BarChart3, ChevronDown, ReceiptText, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isConnected, isCorrectNetwork, account } = useWallet();
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("1W");
  const [gasPrice, setGasPrice] = useState<number>(0);
  
  // Fetch gas price periodically
  useEffect(() => {
    const fetchGasPrice = async () => {
      const price = await getGasPrice();
      setGasPrice(price);
    };
    
    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Contract status query
  const { 
    data: botStatus, 
    isLoading: statusLoading,
    refetch: refetchStatus
  } = useQuery({ 
    queryKey: ['botStatus'], 
    queryFn: getBotStatus,
    enabled: isConnected && isCorrectNetwork,
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Token balances query
  const { 
    data: balances,
    isLoading: balancesLoading,
    refetch: refetchBalances
  } = useQuery({
    queryKey: ['contractBalances'],
    queryFn: getContractBalances,
    enabled: isConnected && isCorrectNetwork,
    refetchInterval: 60000,
  });
  
  // Diagnostics query
  const {
    data: diagnostics,
    isLoading: diagnosticsLoading,
    refetch: refetchDiagnostics
  } = useQuery({
    queryKey: ['diagnostics'],
    queryFn: getDiagnostics,
    enabled: isConnected && isCorrectNetwork,
    refetchInterval: 60000,
  });
  
  // Manual refetch function
  const refetchAll = () => {
    refetchStatus();
    refetchBalances();
    refetchDiagnostics();
  };
  
  // Extract values for display
  const lastTradeTime = botStatus?.lastTradeTime ? getTimeAgo(Number(botStatus.lastTradeTime) * 1000) : 'N/A';
  const lastProfit = botStatus?.lastProfit ? Number(botStatus.lastProfit) / 1e6 : 0;
  const totalRevenue = botStatus?.totalRevenue ? Number(botStatus.totalRevenue) / 1e6 : 0;
  const totalLoss = botStatus?.totalLoss ? Number(botStatus.totalLoss) / 1e6 : 0;
  
  // Get USDC and WETH balances
  const usdcBalance = balances?.balances[0] || 0n;
  const wethBalance = balances?.balances[1] || 0n;
  
  // Get oracle status
  const oracleFresh = diagnostics?.oracle || false;
  
  return (
    <>
      <Helmet>
        <title>CrashSafe Arbitrage Bot Dashboard</title>
        <meta name="description" content="Monitor and control your Ethereum arbitrage bot with real-time performance metrics and controls." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Contract Overview Section */}
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <h2 className="text-xl font-semibold mb-2 sm:mb-0">Contract Overview</h2>
              
              {/* Oracle Status */}
              <div className="flex items-center space-x-3">
                <ContractStatus 
                  label="Oracle" 
                  status={oracleFresh ? "Success" : "Error"} 
                  value={oracleFresh ? "Fresh" : "Stale"}
                />
                
                <div className="flex items-center space-x-1 bg-background-dark rounded-lg px-3 py-1">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{gasPrice.toFixed(1)} Gwei</span>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard 
                title="Total Revenue" 
                value={totalRevenue} 
                icon={<BarChart3 />} 
                trend={5.2} 
                isLoading={statusLoading}
                formatAsCurrency
              />
              
              <StatsCard 
                title="Total Loss" 
                value={totalLoss} 
                icon={<ChevronDown />} 
                trend={-1.8} 
                isLoading={statusLoading}
                formatAsCurrency
              />
              
              <StatsCard 
                title="Last Profit" 
                value={lastProfit} 
                icon={<ReceiptText />} 
                isLoading={statusLoading}
                formatAsCurrency
              />
              
              <StatsCard 
                title="Last Trade" 
                value={lastTradeTime} 
                icon={<Clock />} 
                isLoading={statusLoading}
                isTextValue
              />
            </div>
          </section>
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Chart */}
              <PerformanceChart 
                selectedTimeRange={selectedTimeRange} 
                onTimeRangeChange={setSelectedTimeRange} 
              />
              
              {/* Transaction History */}
              <TransactionHistoryTable />
            </div>
            
            {/* Right Column (1/3 width) */}
            <div className="space-y-6">
              {/* Wallet Balances */}
              <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
                <h3 className="font-semibold mb-4">Wallet Balances</h3>
                
                <div className="space-y-3">
                  <TokenBalanceCard 
                    token="WETH" 
                    name="Wrapped Ethereum"
                    balance={wethBalance}
                    decimals={18}
                    isLoading={balancesLoading}
                    iconType="ethereum"
                    ethPrice={1800} // Hardcoded for demo, should use a price oracle
                  />
                  
                  <TokenBalanceCard 
                    token="USDC" 
                    name="USD Coin"
                    balance={usdcBalance}
                    decimals={6}
                    isLoading={balancesLoading}
                    iconType="dollar"
                    ethPrice={1} // 1:1 with USD
                  />
                </div>
                
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button 
                    disabled={!isConnected || !isCorrectNetwork}
                    className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition text-primary-foreground py-2 rounded-lg font-medium text-sm"
                  >
                    Deposit
                  </button>
                  <button 
                    disabled={!isConnected || !isCorrectNetwork}
                    className="bg-background-dark hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed text-foreground py-2 rounded-lg font-medium text-sm border border-border"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
              
              {/* Control Panel */}
              <BotControlPanel 
                botStatus={botStatus}
                isLoading={statusLoading}
                onActionComplete={refetchAll}
              />
              
              {/* Network Stats */}
              <NetworkStats 
                gasPrice={gasPrice} 
                diagnostics={diagnostics}
                isLoading={diagnosticsLoading}
              />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
