const fs = require("fs");
const path = require("path");

// Load .env file manually into process.env
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  
  await prisma.transactions.deleteMany();
  await prisma.financialCategory.deleteMany();
  await prisma.financialAccount.deleteMany();
  await prisma.twoFactorConfirmation.deleteMany();
  await prisma.twoFactorToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.account.deleteMany();
  await prisma.premium.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  
  console.log("Database cleaned successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
