import { PrismaClient, Role, Dimension, Unit } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@test.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      name: "User",
      email: "user@test.com",
      password: userPassword,
      role: Role.USER,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Rice",
        sku: "RICE-001",
        description: "Premium quality rice",
        dimension: Dimension.WEIGHT,
        baseUnit: Unit.G,
        stockBaseQty: "100000.000000",
        pricePerBaseQty: "0.080000",
      },
      {
        name: "Milk",
        sku: "MILK-001",
        description: "Fresh cow milk",
        dimension: Dimension.VOLUME,
        baseUnit: Unit.ML,
        stockBaseQty: "50000.000000",
        pricePerBaseQty: "0.060000",
      },
      {
        name: "Notebook",
        sku: "NOTE-001",
        description: "Single ruled notebook",
        dimension: Dimension.COUNT,
        baseUnit: Unit.UNIT,
        stockBaseQty: "500.000000",
        pricePerBaseQty: "40.000000",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => {
    console.log("Seed completed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });