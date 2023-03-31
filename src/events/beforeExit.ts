import prisma from "../database/prisma";

process.once("beforeExit", async function () {
  await prisma.$disconnect();
});
