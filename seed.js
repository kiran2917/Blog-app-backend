const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  await prisma.admin.upsert({
    where: {
      username: "kiran"
    },
    update: {
      password
    },
    create: {
      username: "kiran",
      password
    }
  });

  console.log("Admin seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
