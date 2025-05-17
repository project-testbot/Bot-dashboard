import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { getProvider, getSigner, isWalletConnected } from '@/lib/ethers';
import { SUPPORTED_CHAINS } from '@/lib/constants';

interface WalletContextType {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isOwner: boolean;
  isCorrectNetwork: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  chainId: null,
  isConnected: false,
  isOwner: false,
  isCorrectNetwork: false,
  provider: null,
  signer: null,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  switchNetwork: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(11155111); // Set to Sepolia testnet by default
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const targetChainId = SUPPORTED_CHAINS[0].id;
  const isCorrectNetwork = chainId === targetChainId;
  // For demonstration purposes, make owner true when connected
  const isOwner = !!account;

  // Initialize with mock provider state for demo purposes
  useEffect(() => {
    // Set up simulated wallet state for demonstration
    setChainId(11155111); // Sepolia Testnet
    
    // Don't auto-connect in the mockup
    setAccount(null);
    setSigner(null);
  }, []);
  
  // For demo purposes, we'll skip the event listeners setup
  // In a real application, this would listen for wallet events
  useEffect(() => {
    // No events needed for the mockup
    return () => {};
  }, [toast]);
  
  // Simulated connect wallet function for the demo
  const connectWallet = async () => {
    setConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a successful connection with a demo address
      const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
      
      setAccount(mockAddress);
      setChainId(11155111); // Sepolia testnet
      
      toast({
        title: "Wallet Connected",
        description: "Demo wallet has been successfully connected.",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect the demo wallet",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };
  
  // Simulated network switch function for the demo
  const switchNetwork = async () => {
    try {
      // Simulate network switching delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update chain ID to Sepolia
      setChainId(11155111);
      
      toast({
        title: "Network Changed",
        description: "Successfully switched to Sepolia Testnet.",
      });
    } catch (error) {
      console.error("Failed to switch network:", error);
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to the correct network",
        variant: "destructive",
      });
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        isConnected: !!account,
        isOwner,
        isCorrectNetwork,
        provider,
        signer,
        connecting,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
