-- CreateTable
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
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
    "amoebaCoefficient" DOUBLE PRECISION NOT NULL,
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
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "goodReviewRate" DOUBLE PRECISION NOT NULL,
    "dispatchStatus" TEXT NOT NULL,
    "dispatchStatusText" TEXT NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "farmerName" TEXT NOT NULL,
    "coopName" TEXT,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "gridCode" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "acreage" DOUBLE PRECISION NOT NULL,
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
    "assignedTechnicianDistanceKm" DOUBLE PRECISION,
    "assignedTechnicianEtaMin" INTEGER,
    "assignedTechnicianMatchScore" DOUBLE PRECISION,
    "matchedCandidates" JSONB,
    "prescriptionCode" TEXT,
    "prescriptionContent" TEXT,
    "watermarkVerified" BOOLEAN,
    "watermarkTime" TEXT,
    "watermarkGps" TEXT,
    "signedAt" TEXT,
    "settlementAmountCents" INTEGER,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditApplication" (
    "id" TEXT NOT NULL,
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
    "ocrMatchRate" DOUBLE PRECISION NOT NULL,
    "nationalRegistryVerified" BOOLEAN NOT NULL,
    "identityFaceMatched" BOOLEAN NOT NULL,
    "permittedScope" TEXT NOT NULL,
    "validPeriod" TEXT NOT NULL,
    "assignedAmoebaTeam" TEXT NOT NULL,
    "amoebaCoefficient" TEXT NOT NULL,
    "auditNotes" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "AuditApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplyProduct" (
    "id" TEXT NOT NULL,
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
    "scanProgressPct" DOUBLE PRECISION NOT NULL,
    "fleeStatus" TEXT NOT NULL,
    "fleeStatusText" TEXT NOT NULL,
    "fleeLocation" TEXT,
    "prescriptionCommissionRate" DOUBLE PRECISION NOT NULL,
    "monthlySales" DOUBLE PRECISION NOT NULL,
    "traceabilityNodes" JSONB NOT NULL,

    CONSTRAINT "SupplyProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmoebaSettlement" (
    "id" TEXT NOT NULL,
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
    "bankClearedAt" TEXT,

    CONSTRAINT "AmoebaSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FulfillmentEvent" (
    "id" TEXT NOT NULL,
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
    "rating" DOUBLE PRECISION,
    "settlementBonusCents" INTEGER,

    CONSTRAINT "FulfillmentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicianProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "partnerCode" TEXT NOT NULL,
    "certId" TEXT NOT NULL,
    "station" TEXT NOT NULL,
    "pesticideLicense" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "yearsOfService" INTEGER NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "onlineHoursToday" DOUBLE PRECISION NOT NULL,
    "incentiveMultiplier" DOUBLE PRECISION NOT NULL,
    "groupRank" INTEGER NOT NULL,
    "groupName" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "headerProfileUrl" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,

    CONSTRAINT "TechnicianProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceOrder" (
    "id" TEXT NOT NULL,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "orderNo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "urgencyTag" TEXT,
    "urgencyBg" TEXT,
    "status" TEXT NOT NULL,
    "dispatchTimeText" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
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
    "bonusPercent" DOUBLE PRECISION NOT NULL,
    "laborFeeCents" INTEGER NOT NULL,
    "costBreakdown" JSONB NOT NULL,
    "fieldEvidencePhotos" JSONB NOT NULL,
    "diagnosedTargets" JSONB NOT NULL,
    "agronomicAdvice" TEXT NOT NULL,
    "deliveryNoteId" TEXT NOT NULL,
    "farmerSignature" TEXT,
    "signedAt" TEXT,

    CONSTRAINT "ServiceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceOrderPrescriptionDrug" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "ServiceOrderPrescriptionDrug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PesticideCatalogItem" (
    "id" TEXT NOT NULL,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "spec" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "activeIngredient" TEXT,
    "dosage" TEXT,

    CONSTRAINT "PesticideCatalogItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmoebaStat" (
    "id" TEXT NOT NULL,
    "totalMonthIncomeCents" INTEGER NOT NULL,
    "growthPct" DOUBLE PRECISION NOT NULL,
    "serviceCommissionCents" INTEGER NOT NULL,
    "serviceTasksCount" INTEGER NOT NULL,
    "prescriptionDividendCents" INTEGER NOT NULL,
    "teamReferralDividendCents" INTEGER NOT NULL,
    "equityPreDrawCents" INTEGER NOT NULL,
    "groupTargetRate" DOUBLE PRECISION NOT NULL,
    "groupBaselineCents" INTEGER NOT NULL,
    "groupTierBonus" TEXT NOT NULL,

    CONSTRAINT "AmoebaStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMemberFeed" (
    "id" TEXT NOT NULL,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "points" TEXT NOT NULL,

    CONSTRAINT "TeamMemberFeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueTransaction" (
    "id" TEXT NOT NULL,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "RevenueTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MallProduct" (
    "id" TEXT NOT NULL,
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
    "canBookService" BOOLEAN NOT NULL,

    CONSTRAINT "MallProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraceLedgerEntry" (
    "id" TEXT NOT NULL,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "batchNo" TEXT NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "queryTime" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "station" TEXT NOT NULL,

    CONSTRAINT "TraceLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceBooking" (
    "id" TEXT NOT NULL,
    "orderKey" INTEGER NOT NULL DEFAULT 0,
    "serviceType" TEXT NOT NULL,
    "cropType" TEXT NOT NULL,
    "acreage" DOUBLE PRECISION NOT NULL,
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
    "agronomistTitle" TEXT,

    CONSTRAINT "ServiceBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MallOrder" (
    "id" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "totalAmountCents" INTEGER NOT NULL,
    "eligibleForFreeRecipe" BOOLEAN NOT NULL,
    "deliveryStation" TEXT NOT NULL,
    "deliveryEstimate" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "MallOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceOrderPrescriptionDrug_serviceOrderId_idx" ON "ServiceOrderPrescriptionDrug"("serviceOrderId");

-- AddForeignKey
ALTER TABLE "ServiceOrderPrescriptionDrug" ADD CONSTRAINT "ServiceOrderPrescriptionDrug_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "ServiceOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
