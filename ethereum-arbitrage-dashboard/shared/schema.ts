import { pgTable, text, serial, integer, boolean, timestamp, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

// Transaction history table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  txHash: text("tx_hash").notNull().unique(),
  date: timestamp("date").notNull().defaultNow(),
  type: text("type").notNull(),
  amount: text("amount").notNull(), // Store as string to handle BigInt values
  gasUsed: integer("gas_used").notNull(),
  status: text("status").notNull(), // Success, Failed, Pending
  userId: integer("user_id").references(() => users.id),
});

// Bot status table
export const botStatus = pgTable("bot_status", {
  id: serial("id").primaryKey(),
  status: integer("status").notNull().default(0), // 0 = Idle, 1 = Running, etc.
  isFrozen: boolean("is_frozen").notNull().default(false),
  lastTradeTime: timestamp("last_trade_time").defaultNow(),
  totalRevenue: text("total_revenue").notNull().default("0"), // Store as string to handle BigInt
  totalLoss: text("total_loss").notNull().default("0"), // Store as string to handle BigInt
  lastProfit: text("last_profit").notNull().default("0"), // Store as string to handle BigInt
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Bot configuration table
export const botConfig = pgTable("bot_config", {
  id: serial("id").primaryKey(),
  slippageTolerance: integer("slippage_tolerance").notNull().default(50), // 0.5%
  usdcAddress: text("usdc_address").notNull(),
  wethAddress: text("weth_address").notNull(),
  contractAddress: text("contract_address").notNull(),
  vaultAddress: text("vault_address").notNull(),
  cooldownPeriod: integer("cooldown_period").notNull().default(300), // 5 minutes in seconds
});

// User schema for insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Transaction schema for insertion
export const insertTransactionSchema = createInsertSchema(transactions).pick({
  txHash: true,
  date: true,
  type: true,
  amount: true,
  gasUsed: true,
  status: true,
  userId: true,
});

// Bot status schema for insertion/update
export const insertBotStatusSchema = createInsertSchema(botStatus).pick({
  status: true,
  isFrozen: true,
  lastTradeTime: true,
  totalRevenue: true,
  totalLoss: true,
  lastProfit: true,
});

// Bot config schema for insertion/update
export const insertBotConfigSchema = createInsertSchema(botConfig).pick({
  slippageTolerance: true,
  usdcAddress: true,
  wethAddress: true,
  contractAddress: true,
  vaultAddress: true,
  cooldownPeriod: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertBotStatus = z.infer<typeof insertBotStatusSchema>;
export type BotStatus = typeof botStatus.$inferSelect;

export type InsertBotConfig = z.infer<typeof insertBotConfigSchema>;
export type BotConfig = typeof botConfig.$inferSelect;
