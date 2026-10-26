CREATE TABLE "Product" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "price" INTEGER NOT NULL CHECK ("price" > 0 AND "price" <= 100000000),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE TABLE "Order" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "idempotencyKey" TEXT NOT NULL,
  "accessTokenHash" TEXT NOT NULL,
  "accessExpiresAt" DATETIME NOT NULL,
  "cartFingerprint" TEXT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'IDR' CHECK ("currency" = 'IDR'),
  "totalAmount" INTEGER NOT NULL CHECK ("totalAmount" > 0 AND "totalAmount" <= 100000000),
  "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING' CHECK ("paymentStatus" IN ('PENDING','PAID','FAILED','CANCELED','EXPIRED','REFUNDED','PARTIALLY_REFUNDED')),
  "revision" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE TABLE "OrderItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  "unitPrice" INTEGER NOT NULL CHECK ("unitPrice" > 0),
  "quantity" INTEGER NOT NULL CHECK ("quantity" BETWEEN 1 AND 10),
  "subtotal" INTEGER NOT NULL CHECK ("subtotal" = "unitPrice" * "quantity"),
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE "Payment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "providerTransactionId" TEXT,
  "creationStatus" TEXT NOT NULL DEFAULT 'INITIATED' CHECK ("creationStatus" IN ('INITIATED','READY','UNKNOWN','FAILED')),
  "snapToken" TEXT,
  "redirectUrl" TEXT,
  "providerStatus" TEXT,
  "fraudStatus" TEXT,
  "refundedAmount" INTEGER NOT NULL DEFAULT 0 CHECK ("refundedAmount" >= 0),
  "lastVerifiedAt" DATETIME,
  "lastErrorCode" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "Order"("idempotencyKey");
CREATE UNIQUE INDEX "OrderItem_orderId_productId_key" ON "OrderItem"("orderId","productId");
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");
CREATE UNIQUE INDEX "Payment_providerTransactionId_key" ON "Payment"("providerTransactionId");
