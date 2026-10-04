-- CreateTable
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "licenseThumb" TEXT NOT NULL,
    "licenseAuthority" TEXT NOT NULL,
    "licenseExpiry" TEXT NOT NULL,
    "licenseStatus" TEXT NOT NULL,
    "licenseExpiryDays" INTEGER,
    "amoebaTier" TEXT NOT NULL,
    "amoebaTierName" TEXT NOT NULL,
    "amoebaCoefficient" REAL NOT NULL,
    "teamName" TEXT NOT NULL,
    "commissionRatio" TEXT NOT NULL,
    "menteeCount" INTEGER NOT NULL,
    "independentMentees" INTEGER NOT NULL,
    "teamMonthlyOutput" INTEGER NOT NULL,
    "mentorshipAllowanceCents" INTEGER NOT NULL,
    "gridName" TEXT NOT NULL,
    "coverageRadius" INTEGER NOT NULL,
    "boundEquipment" TEXT NOT NULL,
    "completedOrders" INTEGER NOT NULL,
    "operationAcreage" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "goodReviewRate" REAL NOT NULL,
    "dispatchStatus" TEXT NOT NULL,
    "dispatchStatusText" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "farmerName" TEXT NOT NULL,
    "coopName" TEXT,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "gridCode" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "acreage" REAL NOT NULL,
    "cropStage" TEXT NOT NULL,
    "symptom" TEXT NOT NULL,
    "serviceCategory" TEXT NOT NULL,
    "serviceCategoryText" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "urgencyText" TEXT NOT NULL,
    "specialSubsidy" TEXT,
    "reportedTime" TEXT NOT NULL,
    "waitingMinutes" INTEGER NOT NULL,
    "requestedAction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusText" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL,
    "assignedTechnicianId" TEXT,
    "assignedTechnicianName" TEXT,
    "assignedTechnicianPhone" TEXT,
    "assignedTechnicianTitle" TEXT,
    "assignedTechnicianAvatar" TEXT,
    "assignedTechnicianDistanceKm" REAL,
    "assignedTechnicianEtaMin" INTEGER,
    "assignedTechnicianMatchScore" REAL,
    "matchedCandidates" JSONB,
    "prescriptionCode" TEXT,
    "prescriptionContent" TEXT,
    "watermarkVerified" BOOLEAN,
    "watermarkTime" TEXT,
    "watermarkGps" TEXT,
    "signedAt" TEXT,
    "settlementAmountCents" INTEGER
);

-- CreateTable
CREATE TABLE "AuditApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "code" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantType" TEXT NOT NULL,
    "idCard" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "targetGrid" TEXT NOT NULL,
    "urgent" BOOLEAN NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "licenseScanUrl" TEXT NOT NULL,
    "licenseAuthority" TEXT NOT NULL,
    "ocrMatchRate" REAL NOT NULL,
    "nationalRegistryVerified" BOOLEAN NOT NULL,
    "identityFaceMatched" BOOLEAN NOT NULL,
    "permittedScope" TEXT NOT NULL,
    "validPeriod" TEXT NOT NULL,
    "assignedAmoebaTeam" TEXT NOT NULL,
    "amoebaCoefficient" TEXT NOT NULL,
    "auditNotes" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SupplyProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "spec" TEXT NOT NULL,
    "iconType" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "registrationNotes" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "manufactureDate" TEXT NOT NULL,
    "totalCoded" INTEGER NOT NULL,
    "totalCodedUnit" TEXT NOT NULL,
    "scanCount" INTEGER NOT NULL,
    "scanCountUnit" TEXT NOT NULL,
    "scanProgressPct" REAL NOT NULL,
    "fleeStatus" TEXT NOT NULL,
    "fleeStatusText" TEXT NOT NULL,
    "fleeLocation" TEXT,
    "prescriptionCommissionRate" REAL NOT NULL,
    "monthlySales" REAL NOT NULL,
    "traceabilityNodes" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "AmoebaSettlement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "partnerCode" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "partnerAvatarLetter" TEXT NOT NULL,
    "partnerLevel" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "menteeStatus" TEXT NOT NULL,
    "serviceFeeCents" INTEGER NOT NULL,
    "prescriptionBonusCents" INTEGER NOT NULL,
    "mentorshipBonusCents" INTEGER NOT NULL,
    "equityDividendCents" INTEGER NOT NULL,
    "grossAmountCents" INTEGER NOT NULL,
    "taxWithheldCents" INTEGER NOT NULL,
    "netPayCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "bankClearedAt" TEXT
);

-- CreateTable
CREATE TABLE "FulfillmentEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "technicianName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "gps" TEXT,
    "droneModel" TEXT,
    "photoUrl" TEXT,
    "qrTraceCode" TEXT,
    "batchCode" TEXT,
    "rating" REAL,
    "settlementBonusCents" INTEGER
);

-- CreateTable
CREATE TABLE "TechnicianProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "partnerCode" TEXT NOT NULL,
    "certId" TEXT NOT NULL,
    "station" TEXT NOT NULL,
    "pesticideLicense" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "yearsOfService" INTEGER NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "onlineHoursToday" REAL NOT NULL,
    "incentiveMultiplier" REAL NOT NULL,
    "groupRank" INTEGER NOT NULL,
    "groupName" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "headerProfileUrl" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "orderNo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "urgencyTag" TEXT,
    "urgencyBg" TEXT,
    "status" TEXT NOT NULL,
    "dispatchTimeText" TEXT NOT NULL,
    "distanceKm" REAL NOT NULL,
    "gpsCoords" TEXT NOT NULL,
    "farmerName" TEXT NOT NULL,
    "farmerPhone" TEXT NOT NULL,
    "farmerTag" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "roadCondition" TEXT NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "cropScale" TEXT NOT NULL,
    "farmerQuote" TEXT NOT NULL,
    "farmerPhotos" JSONB NOT NULL,
    "estimatedFeeCents" INTEGER NOT NULL,
    "amoebaBonusCents" INTEGER NOT NULL,
    "bonusPercent" REAL NOT NULL,
    "laborFeeCents" INTEGER NOT NULL,
    "costBreakdown" JSONB NOT NULL,
    "fieldEvidencePhotos" JSONB NOT NULL,
    "diagnosedTargets" JSONB NOT NULL,
    "agronomicAdvice" TEXT NOT NULL,
    "deliveryNoteId" TEXT NOT NULL,
    "farmerSignature" TEXT,
    "signedAt" TEXT
);

-- CreateTable
CREATE TABLE "ServiceOrderPrescriptionDrug" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceOrderId" TEXT NOT NULL,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "drugId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "spec" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "activeIngredient" TEXT,
    "dosage" TEXT,
    CONSTRAINT "ServiceOrderPrescriptionDrug_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "ServiceOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PesticideCatalogItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "spec" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "activeIngredient" TEXT,
    "dosage" TEXT
);

-- CreateTable
CREATE TABLE "AmoebaStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalMonthIncomeCents" INTEGER NOT NULL,
    "growthPct" REAL NOT NULL,
    "serviceCommissionCents" INTEGER NOT NULL,
    "serviceTasksCount" INTEGER NOT NULL,
    "prescriptionDividendCents" INTEGER NOT NULL,
    "teamReferralDividendCents" INTEGER NOT NULL,
    "equityPreDrawCents" INTEGER NOT NULL,
    "groupTargetRate" REAL NOT NULL,
    "groupBaselineCents" INTEGER NOT NULL,
    "groupTierBonus" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TeamMemberFeed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "points" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RevenueTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "time" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "ServiceOrderPrescriptionDrug_serviceOrderId_idx" ON "ServiceOrderPrescriptionDrug"("serviceOrderId");
