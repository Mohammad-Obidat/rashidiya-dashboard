/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Advisor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ADVISOR', 'STUDENT');

-- AlterTable
ALTER TABLE "Advisor" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_userId_key" ON "Advisor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- AddForeignKey
ALTER TABLE "Advisor" ADD CONSTRAINT "Advisor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
