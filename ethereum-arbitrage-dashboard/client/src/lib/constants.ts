import { ethers } from "ethers";

// Addresses from the smart contract
export const CONTRACT_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
export const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
export const WETH_ADDRESS = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
export const VAULT_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"; // Using Aave address as placeholder

// ABI definitions for contract interaction
export const CONTRACT_ABI = [
  // Basic functionality
  "function currentStatus() view returns (uint8)",
  "function isFrozen() view returns (bool)",
  "function lastTradeTime() view returns (uint256)",
  "function totalRevenue() view returns (uint256)",
  "function totalLoss() view returns (uint256)",
  "function lastProfit() view returns (uint256)",
  "function slippageTolerance() view returns (uint256)",
  "function vault() view returns (address)",
  
  // Control functions
  "function pause() external",
  "function resume() external",
  "function freeze() external",
  "function startArbitrage(uint256 wethAmount) external",
  "function withdrawToken(address token) external",
  
  // Query functions
  "function getBalances() external view returns (address[] tokens, uint256[] balances)",
  "function diagnose() external view returns (string, uint256, uint256, bool, string)",
  
  // Events
  "event StatusChanged(uint8 status, string reason)",
  "event TradeExecuted(uint256 profit, uint256 gasUsed)",
  "event TradeFailed(string reason)",
  "event TransferToVault(uint256 amount)",
  "event GasStats(uint256 gasUsed, uint256 gasPrice, uint256 estProfit, string note)"
];

export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

// Configuration
export const SUPPORTED_CHAINS = [
  {
    id: 11155111, // Sepolia
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    blockExplorer: "https://sepolia.etherscan.io"
  }
];

// Bot status enum mapping (matches the contract's enum)
export const BOT_STATUS = {
  0: { name: "Idle", color: "gray" },
  1: { name: "Running", color: "green" },
  2: { name: "Paused", color: "yellow" },
  3: { name: "Scanning", color: "blue" },
  4: { name: "Executing", color: "purple" },
  5: { name: "Frozen", color: "red" }
};

// Transaction status mapping
export const TX_STATUS = {
  SUCCESS: { name: "Success", color: "green" },
  FAILED: { name: "Failed", color: "red" },
  PENDING: { name: "Pending", color: "yellow" }
};

// Time ranges for the chart
export const TIME_RANGES = [
  { id: "1D", name: "1 Day" },
  { id: "1W", name: "1 Week" },
  { id: "1M", name: "1 Month" },
  { id: "ALL", name: "All Time" }
];

// Gas price tiers
export const GAS_TIERS = {
  LOW: 20,       // Gwei
  MEDIUM: 35,    // Gwei
  HIGH: 50       // Gwei
};

// Default gas estimate for arbitrage
export const DEFAULT_GAS_ESTIMATE = 250000;
