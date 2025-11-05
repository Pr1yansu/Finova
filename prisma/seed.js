const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "seed-data.json");
  if (!fs.existsSync(filePath)) {
    console.error("seed-data.json not found in prisma folder");
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  console.log(`Seeding ${data.users.length} users ...`);

  for (const u of data.users) {
    const existing = await prisma.user.findUnique({
      where: { email: u.email },
    });
    if (existing) {
      console.log(`Skipping existing user ${u.email}`);
      continue;
    }

    const passwordHash = u.password ? await bcrypt.hash(u.password, 10) : null;

    const createdUser = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: passwordHash,
        role: u.role || "USER",
      },
    });

    // create financial accounts
    const accounts = [];
    if (Array.isArray(u.financialAccounts)) {
      for (const a of u.financialAccounts) {
        const acc = await prisma.financialAccount.create({
          data: {
            userId: createdUser.id,
            name: a.name,
            plaidId: a.plaidId || null,
          },
        });
        accounts.push(acc);
      }
    }

    // create categories
    const categories = [];
    if (Array.isArray(u.categories)) {
      for (const c of u.categories) {
        const cat = await prisma.financialCategory.create({
          data: {
            userId: createdUser.id,
            name: c.name,
            plaidId: c.plaidId || null,
          },
        });
        categories.push(cat);
      }
    }

    // create transactions (refer by index to accounts/categories)
    if (Array.isArray(u.transactions)) {
      for (const t of u.transactions) {
        const account = accounts[t.accountIndex] || accounts[0];
        const category =
          typeof t.categoryIndex === "number"
            ? categories[t.categoryIndex] || null
            : null;

        await prisma.transactions.create({
          data: {
            amount: t.amount,
            payee: t.payee,
            notes: t.notes || null,
            date: new Date(t.date),
            financialAccountId: account.id,
            categoryId: category ? category.id : null,
          },
        });
      }
    }

    console.log(`Created user ${u.email} (${createdUser.id})`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
