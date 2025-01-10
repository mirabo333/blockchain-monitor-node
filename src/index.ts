import { PrismaClient } from "@prisma/client";
import { logger } from "./utils/logger";
import { BlockchainCrawler } from "./crawler";

const prisma = new PrismaClient();

async function main() {
  try {
    // Initialize crawler
    const crawler = new BlockchainCrawler();

    // Handle shutdown gracefully
    process.on("SIGINT", async () => {
      logger.info("Shutting down...");
      await crawler.disconnect();
      process.exit(0);
    });

    // Start monitoring
    await crawler.start();
  } catch (error) {
    logger.error("Application error:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
