-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "WeeklyMenuStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OrderingAvailability" AS ENUM ('OPEN', 'CLOSED');

-- CreateTable
CREATE TABLE "WeeklyMenu" (
    "id" UUID NOT NULL,
    "status" "WeeklyMenuStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT,
    "orderingAvailability" "OrderingAvailability",
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "weeklyMenuId" UUID NOT NULL,
    "copiedFromProductId" UUID,
    "position" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "imageAltText" TEXT,
    "allergenKeys" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dietaryFlagKeys" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "stockLimit" INTEGER,
    "orderingAvailability" "OrderingAvailability",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductContent" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPrice" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NOK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickupSlot" (
    "id" UUID NOT NULL,
    "weeklyMenuId" UUID NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "label" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PickupSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeeklyMenu_status_idx" ON "WeeklyMenu"("status");

-- CreateIndex
CREATE INDEX "WeeklyMenu_publishedAt_idx" ON "WeeklyMenu"("publishedAt");

-- CreateIndex
CREATE INDEX "Product_weeklyMenuId_position_idx" ON "Product"("weeklyMenuId", "position");

-- CreateIndex
CREATE INDEX "Product_copiedFromProductId_idx" ON "Product"("copiedFromProductId");

-- CreateIndex
CREATE INDEX "ProductContent_locale_idx" ON "ProductContent"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "ProductContent_productId_locale_key" ON "ProductContent"("productId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPrice_productId_key" ON "ProductPrice"("productId");

-- CreateIndex
CREATE INDEX "PickupSlot_weeklyMenuId_position_idx" ON "PickupSlot"("weeklyMenuId", "position");

-- CreateIndex
CREATE INDEX "PickupSlot_startsAt_idx" ON "PickupSlot"("startsAt");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_weeklyMenuId_fkey" FOREIGN KEY ("weeklyMenuId") REFERENCES "WeeklyMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_copiedFromProductId_fkey" FOREIGN KEY ("copiedFromProductId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductContent" ADD CONSTRAINT "ProductContent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickupSlot" ADD CONSTRAINT "PickupSlot_weeklyMenuId_fkey" FOREIGN KEY ("weeklyMenuId") REFERENCES "WeeklyMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
