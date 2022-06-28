const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getProducts().map((product) => {
      const data = { ...product };
      return db.product.create({ data });
    })
  );
}

seed();

function getProducts() {
  return [
    {
      name: "Product 1",
      description: "A cool product",
      price: 19.99,
      units: 100,
      imgUrl: "https://www.fillmurray.com/300/300"
    },
    {
      name: "Product 2",
      description: "A second cool product",
      price: 29.99,
      units: 100,
      imgUrl: "https://www.placecage.com/c/300/300"
    },
    {
      name: "Product 3",
      description: "A third cool product",
      price: 39.99,
      units: 100,
      imgUrl: "https://www.placecage.com/300/300"
    }
  ];
}
