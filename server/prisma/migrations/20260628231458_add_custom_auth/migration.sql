-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- Existing demo applications may have userId values like "user-1" from fake auth.
-- Create placeholder users for those rows before adding the required foreign key.
INSERT INTO "User" ("id", "name", "email", "passwordHash", "updatedAt")
SELECT DISTINCT
    "userId",
    'Legacy User',
    "userId" || '@legacy.local',
    'legacy-password-hash',
    CURRENT_TIMESTAMP
FROM "Application"
WHERE "userId" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
