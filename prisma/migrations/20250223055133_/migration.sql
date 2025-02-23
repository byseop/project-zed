/*
  Warnings:

  - You are about to drop the column `id_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "id_token",
DROP COLUMN "scope",
DROP COLUMN "session_state";
