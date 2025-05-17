import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertBotStatusSchema, insertBotConfigSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // ===== BOT STATUS ENDPOINTS =====
  
  // Get bot status - initially use database, fall back to mock data
  app.get('/api/bot/status', async (req, res) => {
    try {
      const dbStatus = await storage.getBotStatus();
      
      if (dbStatus) {
        res.json({
          status: dbStatus.status,
          isFrozen: dbStatus.isFrozen,
          lastTradeTime: dbStatus.lastTradeTime.getTime() / 1000,
          totalRevenue: dbStatus.totalRevenue,
          totalLoss: dbStatus.totalLoss,
          lastProfit: dbStatus.lastProfit
        });
      } else {
        // Return mock data if no status found in DB
        res.json({
          status: 0, // Idle
          isFrozen: false,
          lastTradeTime: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
          totalRevenue: "5000000000", // 5000 USDC
          totalLoss: "1200000000", // 1200 USDC
          lastProfit: "320000000" // 320 USDC
        });
      }
    } catch (error) {
      console.error("Error fetching bot status:", error);
      res.status(500).json({ error: "Failed to fetch bot status" });
    }
  });
  
  // Update bot status
  app.post('/api/bot/status', async (req, res) => {
    try {
      const statusData = insertBotStatusSchema.parse(req.body);
      const updatedStatus = await storage.updateBotStatus(statusData);
      res.json(updatedStatus);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid status data", details: error.errors });
      } else {
        console.error("Error updating bot status:", error);
        res.status(500).json({ error: "Failed to update bot status" });
      }
    }
  });

  // ===== DIAGNOSTICS ENDPOINTS =====
  
  // Get diagnostics data
  app.get('/api/bot/diagnostics', async (req, res) => {
    try {
      const botConfig = await storage.getBotConfig();
      const botStatus = await storage.getBotStatus();
      
      if (botConfig && botStatus) {
        res.json({
          chain: "Sepolia",
          profit: botStatus.lastProfit,
          slippage: botConfig.slippageTolerance.toString(),
          oracle: true,
          error: botStatus.isFrozen ? "Frozen" : "OK"
        });
      } else {
        // Return mock data if no configuration found
        res.json({
          chain: "Sepolia",
          profit: "320000000",
          slippage: "50",
          oracle: true,
          error: "OK"
        });
      }
    } catch (error) {
      console.error("Error fetching diagnostics:", error);
      res.status(500).json({ error: "Failed to fetch diagnostics" });
    }
  });

  // ===== BOT CONFIGURATION ENDPOINTS =====
  
  // Get bot configuration
  app.get('/api/bot/config', async (req, res) => {
    try {
      const config = await storage.getBotConfig();
      
      if (config) {
        res.json(config);
      } else {
        res.status(404).json({ error: "Bot configuration not found" });
      }
    } catch (error) {
      console.error("Error fetching bot config:", error);
      res.status(500).json({ error: "Failed to fetch bot configuration" });
    }
  });
  
  // Update bot configuration
  app.post('/api/bot/config', async (req, res) => {
    try {
      const configData = insertBotConfigSchema.parse(req.body);
      const updatedConfig = await storage.updateBotConfig(configData);
      res.json(updatedConfig);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid configuration data", details: error.errors });
      } else {
        console.error("Error updating bot config:", error);
        res.status(500).json({ error: "Failed to update bot configuration" });
      }
    }
  });

  // ===== TRANSACTION ENDPOINTS =====
  
  // Get recent transactions
  app.get('/api/transactions', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const transactions = await storage.getTransactions(limit);
      
      if (transactions.length > 0) {
        res.json(transactions);
      } else {
        // Return mock transactions if none found in database
        const mockTransactions = generateMockTransactions();
        res.json(mockTransactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });
  
  // Create a new transaction
  app.post('/api/transactions', async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const newTransaction = await storage.createTransaction(transactionData);
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      } else {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Failed to create transaction" });
      }
    }
  });

  // ===== WALLET BALANCE ENDPOINTS =====
  
  // Get wallet balances (mock data)
  app.get('/api/bot/balances', (req, res) => {
    res.json({
      tokens: ["0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"],
      balances: ["12500000000", "1500000000000000000"] // 12,500 USDC, 1.5 WETH
    });
  });
  
  // Helper function to generate mock transactions for demo purposes
  function generateMockTransactions() {
    const transactions = [];
    const now = new Date();
    
    for (let i = 0; i < 10; i++) {
      const date = new Date(now.getTime() - i * 3600000); // 1 hour apart
      const success = Math.random() > 0.2; // 80% success rate
      
      transactions.push({
        id: i + 1,
        txHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        date,
        type: 'Arbitrage',
        amount: success ? (Math.random() * 2000 + 100).toFixed(2) : (-Math.random() * 500 - 10).toFixed(2),
        gasUsed: Math.floor(Math.random() * 100000) + 200000,
        status: success ? 'Success' : 'Failed'
      });
    }
    
    return transactions;
  }
  
  return httpServer;
}
