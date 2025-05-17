import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Play, 
  Pause, 
  AlertTriangle, 
  PlayCircle 
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { startArbitrage, pauseBot, resumeBot, freezeBot } from '@/lib/ethers';
import { BOT_STATUS, DEFAULT_GAS_ESTIMATE } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

interface BotControlPanelProps {
  botStatus: {
    status: number;
    isFrozen: boolean;
  } | null | undefined;
  isLoading: boolean;
  onActionComplete: () => void;
}

const BotControlPanel: React.FC<BotControlPanelProps> = ({ 
  botStatus, 
  isLoading,
  onActionComplete
}) => {
  const { isConnected, isCorrectNetwork, isOwner } = useWallet();
  const [wethAmount, setWethAmount] = useState('0.5');
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Get current bot status
  const currentStatus = botStatus?.status !== undefined 
    ? BOT_STATUS[botStatus.status as keyof typeof BOT_STATUS].name 
    : 'Unknown';
  const isFrozen = botStatus?.isFrozen || false;
  
  // Handle input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input with decimals
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWethAmount(value);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !isCorrectNetwork || !isOwner) {
      toast({
        title: "Action Failed",
        description: "Please connect your wallet with the correct network and owner permissions.",
        variant: "destructive",
      });
      return;
    }
    
    if (!wethAmount || Number(wethAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid WETH amount.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const tx = await startArbitrage(wethAmount);
      
      toast({
        title: "Transaction Submitted",
        description: "Arbitrage transaction has been sent to the network.",
      });
      
      await tx?.wait();
      
      toast({
        title: "Arbitrage Started",
        description: "The arbitrage operation has been initiated successfully.",
        variant: "success",
      });
      
      onActionComplete();
    } catch (error) {
      console.error("Failed to start arbitrage:", error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to start arbitrage",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle pause button
  const handlePause = async () => {
    if (!isConnected || !isCorrectNetwork || !isOwner) return;
    
    setSubmitting(true);
    
    try {
      const tx = await pauseBot();
      
      toast({
        title: "Transaction Submitted",
        description: "Pause transaction has been sent to the network.",
      });
      
      await tx?.wait();
      
      toast({
        title: "Bot Paused",
        description: "The bot has been paused successfully.",
        variant: "success",
      });
      
      onActionComplete();
    } catch (error) {
      console.error("Failed to pause bot:", error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to pause bot",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle resume button
  const handleResume = async () => {
    if (!isConnected || !isCorrectNetwork || !isOwner) return;
    
    setSubmitting(true);
    
    try {
      const tx = await resumeBot();
      
      toast({
        title: "Transaction Submitted",
        description: "Resume transaction has been sent to the network.",
      });
      
      await tx?.wait();
      
      toast({
        title: "Bot Resumed",
        description: "The bot has been resumed successfully.",
        variant: "success",
      });
      
      onActionComplete();
    } catch (error) {
      console.error("Failed to resume bot:", error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to resume bot",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle freeze button
  const handleFreezeConfirm = async () => {
    if (!isConnected || !isCorrectNetwork || !isOwner) return;
    
    setSubmitting(true);
    
    try {
      const tx = await freezeBot();
      
      toast({
        title: "Transaction Submitted",
        description: "Freeze transaction has been sent to the network.",
      });
      
      await tx?.wait();
      
      toast({
        title: "Bot Frozen",
        description: "The bot has been frozen successfully.",
        variant: "success",
      });
      
      onActionComplete();
    } catch (error) {
      console.error("Failed to freeze bot:", error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to freeze bot",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setFreezeModalOpen(false);
    }
  };
  
  if (!isConnected || !isCorrectNetwork) {
    return (
      <Card className="rounded-xl shadow-lg border border-border">
        <CardContent className="p-5">
          <h3 className="font-semibold mb-4">Bot Controls</h3>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Connect your wallet to access bot controls</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const isPaused = currentStatus === 'Paused';
  const isRunning = currentStatus === 'Running';
  const showControls = isOwner && !isLoading;
  
  return (
    <>
      <Card className="rounded-xl shadow-lg border border-border">
        <CardContent className="p-5">
          <h3 className="font-semibold mb-4">Bot Controls</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              {!isOwner ? (
                <div className="p-6 text-center border border-border rounded-lg mb-4">
                  <p className="text-muted-foreground">Only the contract owner can control the bot</p>
                </div>
              ) : (
                <>
                  {/* Start Arbitrage Form */}
                  <form className="mb-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="wethAmount" className="block text-sm text-muted-foreground mb-1">WETH Amount</Label>
                        <div className="relative">
                          <Input
                            id="wethAmount"
                            type="text"
                            placeholder="0.5"
                            value={wethAmount}
                            onChange={handleAmountChange}
                            className="bg-background w-full pr-12"
                            disabled={submitting || isFrozen || !showControls}
                          />
                          <div className="absolute right-3 top-2 text-muted-foreground">ETH</div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Est. Gas: ~{DEFAULT_GAS_ESTIMATE.toLocaleString()}</p>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-secondary hover:bg-secondary/90 transition text-white"
                        disabled={submitting || isFrozen || !showControls}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        <span>{submitting ? 'Processing...' : 'Start Arbitrage'}</span>
                      </Button>
                    </div>
                  </form>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button
                      variant={isPaused ? "outline" : "warning"}
                      onClick={handlePause}
                      disabled={submitting || isPaused || isFrozen || !showControls}
                      className="flex items-center justify-center"
                    >
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </Button>
                    <Button
                      variant={isRunning ? "outline" : "info"}
                      onClick={handleResume}
                      disabled={submitting || isRunning || isFrozen || !showControls}
                      className="flex items-center justify-center"
                    >
                      <Play className="mr-2 h-4 w-4" /> Resume
                    </Button>
                  </div>
                  
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center"
                    onClick={() => setFreezeModalOpen(true)}
                    disabled={submitting || isFrozen || !showControls}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" /> Emergency Freeze
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Freeze Confirmation Modal */}
      <ConfirmationModal
        isOpen={freezeModalOpen}
        onClose={() => setFreezeModalOpen(false)}
        onConfirm={handleFreezeConfirm}
        title="Emergency Freeze Confirmation"
        message="This will immediately halt all bot operations. Are you sure you want to proceed?"
        confirmText="Confirm Freeze"
        isSubmitting={submitting}
        destructive
      />
    </>
  );
};

export default BotControlPanel;
