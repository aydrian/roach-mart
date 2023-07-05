import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function seed() {
  // Create an initial user
  const userPromise = prisma.user.create({
    data: {
      id: "8e346dd2-4e44-40f1-a19e-45ffe0be1e09",
      password: { create: { hash: await bcrypt.hash("password1234", 10) } },
      username: "shopper"
    }
  });

  // Create products
  const productsPromise = prisma.product.createMany({
    data: [
      {
        description:
          "A 32 oz water bottle in purple with the Cockroach Labs logo",
        id: "0f4eff64-7ae3-44ac-b4dc-cf1ec7195119",
        imgUrl: "/images/insulated-water-bottle.png",
        name: "Insulated Water Bottle",
        price: new Prisma.Decimal(39.99),
        units: 100
      },
      {
        description: "A black trucker-style hat with the Cockroach Labs mark",
        id: "c9dd3454-6eae-4fb2-b965-cc889ef28f47",
        imgUrl: "/images/trucker-hat.png",
        name: "Trucker Hat",
        price: new Prisma.Decimal(29.99),
        units: 100
      },
      {
        description:
          "A black moleskin notebook with the Cockroach Labs mark on the front cover",
        id: "fe898455-bc86-469c-8075-377944eb873b",
        imgUrl: "/images/moleskin-notebook.png",
        name: "Moleskin Notebook",
        price: new Prisma.Decimal(19.99),
        units: 100
      }
    ]
  });

  await Promise.all([userPromise, productsPromise]);
}

seed();
