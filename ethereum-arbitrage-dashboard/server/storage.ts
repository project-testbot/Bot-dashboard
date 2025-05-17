import { 
  users, type User, type InsertUser,
  transactions, type Transaction, type InsertTransaction,
  botStatus, type BotStatus, type InsertBotStatus,
  botConfig, type BotConfig, type InsertBotConfig
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Enhanced storage interface for our database entities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction operations
  getTransactions(limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Bot status operations
  getBotStatus(): Promise<BotStatus | undefined>;
  updateBotStatus(status: InsertBotStatus): Promise<BotStatus>;
  
  // Bot config operations
  getBotConfig(): Promise<BotConfig | undefined>;
  updateBotConfig(config: InsertBotConfig): Promise<BotConfig>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Transaction operations
  async getTransactions(limit: number = 10): Promise<Transaction[]> {
    return await db.select()
      .from(transactions)
      .orderBy(desc(transactions.date))
      .limit(limit);
  }
  
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }
  
  // Bot status operations
  async getBotStatus(): Promise<BotStatus | undefined> {
    const [status] = await db.select().from(botStatus).limit(1);
    return status;
  }
  
  async updateBotStatus(status: InsertBotStatus): Promise<BotStatus> {
    // Check if a status record exists
    const existingStatus = await this.getBotStatus();
    
    if (existingStatus) {
      // Update existing record
      const [updatedStatus] = await db.update(botStatus)
        .set({
          ...status,
          updatedAt: new Date()
        })
        .where(eq(botStatus.id, existingStatus.id))
        .returning();
      return updatedStatus;
    } else {
      // Create first status record
      const [newStatus] = await db.insert(botStatus)
        .values({
          ...status,
          updatedAt: new Date()
        })
        .returning();
      return newStatus;
    }
  }
  
  // Bot config operations
  async getBotConfig(): Promise<BotConfig | undefined> {
    const [config] = await db.select().from(botConfig).limit(1);
    return config;
  }
  
  async updateBotConfig(config: InsertBotConfig): Promise<BotConfig> {
    // Check if a config record exists
    const existingConfig = await this.getBotConfig();
    
    if (existingConfig) {
      // Update existing record
      const [updatedConfig] = await db.update(botConfig)
        .set(config)
        .where(eq(botConfig.id, existingConfig.id))
        .returning();
      return updatedConfig;
    } else {
      // Create first config record
      const [newConfig] = await db.insert(botConfig)
        .values(config)
        .returning();
      return newConfig;
    }
  }
}

// Export a database storage instance
export const storage = new DatabaseStorage();
