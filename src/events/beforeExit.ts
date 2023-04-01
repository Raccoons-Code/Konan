import prisma from "../database/prisma";

process.once("beforeExit", async function (_code) {
  await prisma.$disconnect();
});
