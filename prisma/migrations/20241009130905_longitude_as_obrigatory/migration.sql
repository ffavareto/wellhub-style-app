/*
  Warnings:

  - Made the column `longitude` on table `gyms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "gyms" ALTER COLUMN "longitude" SET NOT NULL;
