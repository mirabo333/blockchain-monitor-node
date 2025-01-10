-- CreateTable
CREATE TABLE "Block" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "baseFeePerGas" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "extraData" TEXT NOT NULL,
    "gasLimit" TEXT NOT NULL,
    "gasUsed" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "logsBloom" TEXT NOT NULL,
    "miner" TEXT NOT NULL,
    "mixHash" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "parentHash" TEXT NOT NULL,
    "receiptsRoot" TEXT NOT NULL,
    "sha3Uncles" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "stateRoot" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "totalDifficulty" TEXT NOT NULL,
    "transactions" TEXT NOT NULL,
    "transactionsRoot" TEXT NOT NULL,
    "uncles" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "blockHash" TEXT NOT NULL,
    "blockNumber" TEXT NOT NULL,
    "transactionIndex" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT,
    "value" TEXT NOT NULL,
    "gasPrice" TEXT NOT NULL,
    "gas" TEXT NOT NULL,
    "input" TEXT,
    "r" TEXT NOT NULL,
    "s" TEXT NOT NULL,
    "v" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transactionHash" TEXT NOT NULL,
    "blockHash" TEXT NOT NULL,
    "blockNumber" TEXT NOT NULL,
    "cumulativeGasUsed" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT,
    "contractAddress" TEXT,
    "gasUsed" TEXT NOT NULL,
    "logs" TEXT,
    "logsBloom" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transactionIndex" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_number_key" ON "Block"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_hash_key" ON "Transaction"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_transactionHash_key" ON "Receipt"("transactionHash");
