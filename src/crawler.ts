import Web3 from "web3";
import WebSocketProvider from "web3-providers-ws";
import Eth from "web3-eth";
import { PrismaClient, Prisma } from "@prisma/client";
import { logger } from "./utils/logger";
import { transformValuesToString } from "./utils/dataTransformer";

export class BlockchainCrawler {
  private web3: Web3;
  private prisma: PrismaClient;
  private provider: WebSocketProvider;

  constructor() {
    const options = {
      timeout: 30000, // ms
      reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false,
      },
    };

    this.provider = new WebSocketProvider(
      process.env.METADIUM_TESTNET_WS_URL || "wss://ws.metadium.com/dev",
      options
    );

    this.web3 = new Web3(this.provider);
    this.prisma = new PrismaClient();

    this.provider.on("connect", () => {
      logger.info("Connected to blockchain");
      this.subscribeToEvents();
    });

    this.provider.on("error", (error: unknown) => {
      logger.error("WebSocket error:", error as Error);
    });

    this.provider.on("end", () => {
      logger.info("WebSocket disconnected. Attempting to reconnect...");
    });
  }

  public async disconnect() {
    try {
      // Disconnect WebSocket provider
      if (this.provider && this.provider.SocketConnection) {
        await this.provider.disconnect();
      }

      // Disconnect Prisma client
      await this.prisma.$disconnect();

      logger.info("Crawler disconnected successfully");
    } catch (error) {
      logger.error("Error during disconnect:", error);
      throw error;
    }
  }

  private async reconnect() {
    try {
      if (this.provider.SocketConnection) {
        await this.provider.disconnect();
      }

      await this.provider.connect();

      if (!this.provider.SocketConnection) {
        throw new Error("Failed to reconnect");
      }
    } catch (error) {
      logger.error("Reconnection failed:", error);
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  private async subscribeToEvents() {
    try {
      const web3Eth: Eth = this.web3.eth;
      const subscription = await web3Eth.subscribe("newBlockHeaders");

      // Subscribe to new block headers
      subscription.on("data", async (blockHeader: any) => {
        await this.processNewBlock(blockHeader);
      });

      subscription.on("error", (error: Error) => {
        logger.error("Subscription error:", error);
      });
    } catch (error) {
      logger.error("Subscribe error:", error);
    }
  }

  private async processNewBlock(blockHeader: any) {
    try {
      const blockNumber = blockHeader.number;
      const fullBlock = await this.web3.eth.getBlock(blockNumber, true);

      const stringBlock =
        transformValuesToString<Prisma.BlockCreateInput>(fullBlock);

      console.log(stringBlock, ":: fullblock");

      // Save raw block data
      await this.prisma.block.create({
        data: stringBlock,
      });

      // Process and save raw transactions and receipts
      for (const tx of fullBlock.transactions) {
        const stringTx =
          transformValuesToString<Prisma.TransactionCreateInput>(tx);
        // console.log("tx::::", tx);

        // Save raw transaction
        // transactions
        await this.prisma.transaction.create({
          data: stringTx,
        });

        if (typeof tx === "object" && tx.hash) {
          const receipt = await this.web3.eth.getTransactionReceipt(tx.hash);
          if (receipt) {
            const stringReceipt =
              transformValuesToString<Prisma.ReceiptCreateInput>(receipt);
            // console.log("receipt", receipt);
            await this.prisma.receipt.create({
              data: stringReceipt,
            });
          }
        }
      }

      logger.info(
        `Processed block #${blockNumber} with ${fullBlock.transactions.length} transactions`
      );
    } catch (error) {
      logger.error("Error processing block:", error);
      throw error;
    }
  }

  public async start(): Promise<void> {
    try {
      logger.info("Starting blockchain crawler...");
    } catch (error) {
      logger.error("Crawler error:", error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    try {
      await this.web3.eth.clearSubscriptions();
      this.provider.disconnect();
      await this.prisma.$disconnect();
      logger.info("Crawler stopped");
    } catch (error) {
      logger.error("Error stopping crawler:", error);
      throw error;
    }
  }
}
