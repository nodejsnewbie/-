-- CreateTable
CREATE TABLE "MallProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "spec" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "badge" TEXT,
    "badgeColor" TEXT,
    "tags" JSONB NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "batchNo" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "originalPriceCents" INTEGER,
    "soldCount" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "traceCode" TEXT NOT NULL,
    "activeIngredient" TEXT NOT NULL,
    "toxicity" TEXT NOT NULL,
    "formulation" TEXT NOT NULL,
    "targetDisease" TEXT NOT NULL,
    "dosagePerMu" TEXT NOT NULL,
    "waterPerMu" TEXT NOT NULL,
    "safeInterval" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "highlightText" TEXT,
    "isOfficialDirect" BOOLEAN NOT NULL,
    "canBookService" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "TraceLedgerEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "batchNo" TEXT NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "queryTime" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "station" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceBooking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "serviceType" TEXT NOT NULL,
    "cropType" TEXT NOT NULL,
    "acreage" REAL NOT NULL,
    "preferredDate" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "station" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "plotAddress" TEXT NOT NULL,
    "associatedProducts" JSONB NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL,
    "agronomistName" TEXT,
    "agronomistCertId" TEXT,
    "agronomistPhone" TEXT,
    "agronomistTitle" TEXT
);

-- CreateTable
CREATE TABLE "MallOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "totalAmountCents" INTEGER NOT NULL,
    "eligibleForFreeRecipe" BOOLEAN NOT NULL,
    "deliveryStation" TEXT NOT NULL,
    "deliveryEstimate" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
