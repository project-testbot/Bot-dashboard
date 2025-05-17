import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS, ERC20_ABI, USDC_ADDRESS, WETH_ADDRESS } from "./constants";

// Get provider depending on the environment
export const getProvider = (): ethers.BrowserProvider | null => {
  try {
    // For the mockup dashboard, we'll simulate a provider
    return null;
  } catch (error) {
    console.error("Provider error:", error);
    return null;
  }
};

// Get signer for transactions
export const getSigner = async (): Promise<ethers.Signer | null> => {
  const provider = getProvider();
  if (!provider) return null;
  
  try {
    return await provider.getSigner();
  } catch (error) {
    console.error("Failed to get signer:", error);
    return null;
  }
};

// Get contract instance
export const getContract = async (
  address: string, 
  abi: any[], 
  signer?: ethers.Signer | null
): Promise<ethers.Contract | null> => {
  try {
    const signerOrProvider = signer || getProvider();
    if (!signerOrProvider) return null;
    
    return new ethers.Contract(address, abi, signerOrProvider);
  } catch (error) {
    console.error("Failed to get contract:", error);
    return null;
  }
};

// Get USDC token contract
export const getUsdcContract = async (signer?: ethers.Signer | null): Promise<ethers.Contract | null> => {
  return getContract(USDC_ADDRESS, ERC20_ABI, signer);
};

// Get WETH token contract
export const getWethContract = async (signer?: ethers.Signer | null): Promise<ethers.Contract | null> => {
  return getContract(WETH_ADDRESS, ERC20_ABI, signer);
};

// Get arbitrage bot contract
export const getBotContract = async (signer?: ethers.Signer | null): Promise<ethers.Contract | null> => {
  return getContract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// Helper to check if a wallet is connected
export const isWalletConnected = async (): Promise<boolean> => {
  const provider = getProvider();
  if (!provider) return false;
  
  try {
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  } catch (error) {
    console.error("Failed to check if wallet is connected:", error);
    return false;
  }
};

// Get the account balance of a specific token
export const getTokenBalance = async (
  tokenAddress: string,
  accountAddress: string
): Promise<bigint> => {
  try {
    const tokenContract = await getContract(tokenAddress, ERC20_ABI);
    if (!tokenContract) throw new Error("Could not get token contract");
    
    return await tokenContract.balanceOf(accountAddress);
  } catch (error) {
    console.error(`Failed to get token balance for ${tokenAddress}:`, error);
    return 0n;
  }
};

// Get token info (symbol, name, decimals)
export const getTokenInfo = async (tokenAddress: string): Promise<{ symbol: string; name: string; decimals: number }> => {
  try {
    const tokenContract = await getContract(tokenAddress, ERC20_ABI);
    if (!tokenContract) throw new Error("Could not get token contract");
    
    const [symbol, name, decimals] = await Promise.all([
      tokenContract.symbol(),
      tokenContract.name(),
      tokenContract.decimals()
    ]);
    
    return { symbol, name, decimals };
  } catch (error) {
    console.error(`Failed to get token info for ${tokenAddress}:`, error);
    return { symbol: "???", name: "Unknown Token", decimals: 18 };
  }
};

// Get current gas price (mock data for testing)
export const getGasPrice = async (): Promise<number> => {
  try {
    // Return a realistic gas price value for testing
    return 25 + Math.random() * 10; // random value between 25-35 Gwei
  } catch (error) {
    console.error("Failed to get gas price:", error);
    return 25;
  }
};

// Start arbitrage
export const startArbitrage = async (wethAmount: string): Promise<ethers.TransactionResponse | null> => {
  try {
    const signer = await getSigner();
    if (!signer) throw new Error("No signer available");
    
    const contract = await getBotContract(signer);
    if (!contract) throw new Error("Could not get contract");
    
    // Convert ETH amount to Wei
    const wethAmountWei = ethers.parseEther(wethAmount);
    
    // Estimate gas for transaction
    const gasEstimate = await contract.startArbitrage.estimateGas(wethAmountWei);
    
    // Execute transaction with estimated gas
    return await contract.startArbitrage(wethAmountWei, {
      gasLimit: gasEstimate * 110n / 100n // Add 10% buffer
    });
  } catch (error) {
    console.error("Failed to start arbitrage:", error);
    throw error;
  }
};

// Pause the bot
export const pauseBot = async (): Promise<ethers.TransactionResponse | null> => {
  try {
    const signer = await getSigner();
    if (!signer) throw new Error("No signer available");
    
    const contract = await getBotContract(signer);
    if (!contract) throw new Error("Could not get contract");
    
    return await contract.pause();
  } catch (error) {
    console.error("Failed to pause bot:", error);
    throw error;
  }
};

// Resume the bot
export const resumeBot = async (): Promise<ethers.TransactionResponse | null> => {
  try {
    const signer = await getSigner();
    if (!signer) throw new Error("No signer available");
    
    const contract = await getBotContract(signer);
    if (!contract) throw new Error("Could not get contract");
    
    return await contract.resume();
  } catch (error) {
    console.error("Failed to resume bot:", error);
    throw error;
  }
};

// Freeze the bot (emergency)
export const freezeBot = async (): Promise<ethers.TransactionResponse | null> => {
  try {
    const signer = await getSigner();
    if (!signer) throw new Error("No signer available");
    
    const contract = await getBotContract(signer);
    if (!contract) throw new Error("Could not get contract");
    
    return await contract.freeze();
  } catch (error) {
    console.error("Failed to freeze bot:", error);
    throw error;
  }
};

// Get contract diagnostics
export const getDiagnostics = async (): Promise<{
  chain: string;
  profit: bigint;
  slippage: bigint;
  oracle: boolean;
  error: string;
} | null> => {
  try {
    // Use the mock API instead of trying to connect to blockchain
    const response = await fetch('/api/bot/diagnostics');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert string values to bigint for compatibility with the existing code
    return {
      chain: data.chain,
      profit: BigInt(data.profit),
      slippage: BigInt(data.slippage),
      oracle: data.oracle,
      error: data.error
    };
  } catch (error) {
    console.error("Failed to get diagnostics:", error);
    return null;
  }
};

// Get contract status and other key metrics
export const getBotStatus = async (): Promise<{
  status: number;
  isFrozen: boolean;
  lastTradeTime: bigint;
  totalRevenue: bigint;
  totalLoss: bigint;
  lastProfit: bigint;
} | null> => {
  try {
    // Use the mock API instead of trying to connect to blockchain
    const response = await fetch('/api/bot/status');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert string values to bigint for compatibility with the existing code
    return {
      status: data.status,
      isFrozen: data.isFrozen,
      lastTradeTime: BigInt(data.lastTradeTime),
      totalRevenue: BigInt(data.totalRevenue),
      totalLoss: BigInt(data.totalLoss),
      lastProfit: BigInt(data.lastProfit)
    };
  } catch (error) {
    console.error("Failed to get bot status:", error);
    return null;
  }
};

// Get token balances
export const getContractBalances = async (): Promise<{
  tokens: string[];
  balances: bigint[];
} | null> => {
  try {
    // Use the mock API instead of trying to connect to blockchain
    const response = await fetch('/api/bot/balances');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert string values to bigint for compatibility with the existing code
    return {
      tokens: data.tokens,
      balances: data.balances.map((b: string) => BigInt(b))
    };
  } catch (error) {
    console.error("Failed to get contract balances:", error);
    return null;
  }
};

// Withdraw token from contract
export const withdrawToken = async (tokenAddress: string): Promise<ethers.TransactionResponse | null> => {
  try {
    const signer = await getSigner();
    if (!signer) throw new Error("No signer available");
    
    const contract = await getBotContract(signer);
    if (!contract) throw new Error("Could not get contract");
    
    return await contract.withdrawToken(tokenAddress);
  } catch (error) {
    console.error("Failed to withdraw token:", error);
    throw error;
  }
};
