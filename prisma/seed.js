const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getRoaches().map((roach) => {
      const data = { ...roach };
      return db.product.create({ data });
    })
  );
}

seed();

function getRoaches() {
  return [
    {
      description:
        "The German cockroach, colloquially known as the croton bug, is a species of small cockroach, typically about 1.1 to 1.6 cm long. In color it varies from tan to almost black, and it has two dark, roughly parallel, streaks on the pronotum running anteroposteriorly from behind the head to the base of the wings.",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Blattodea._Cascuda._Santiago_de_Compostela_1.jpg/220px-Blattodea._Cascuda._Santiago_de_Compostela_1.jpg",
      name: "German cockroach",
      price: 19.99,
      units: 100
    },
    {
      description:
        "The Oriental cockroach, also known as the waterbug or black cockroaches, is a large species of cockroach, adult males being 18–29 mm and adult females being 20–27 mm. It is dark brown or black in color and has a glossy body.",
      imgUrl:
        "https://cdn.branchcms.com/Yj0Dao1bVx-1285/images/pest-id/oriental-cockroaches.jpg",
      name: "Oriental cockroach",
      price: 29.99,
      units: 100
    },
    {
      description:
        "The American cockroach is the largest species of common cockroach, and often considered a pest. In certain regions of the U.S. it is colloquially known as the waterbug, though it is not a true waterbug since it is not aquatic. It is also known as the ship cockroach, kakerlac, and Bombay canary.",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/American-cockroach.jpg/220px-American-cockroach.jpg",
      name: "American cockroach",
      price: 39.99,
      units: 100
    },
    {
      description:
        "Blaptica dubia, the Dubia roach, orange-spotted roach, Guyana spotted roach, or Argentinian wood roach, is a medium-sized species of cockroach which grows to around 40–45 mm.",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Dubia-cockroach-female-near-ruler.jpg/220px-Dubia-cockroach-female-near-ruler.jpg",
      name: "Dubia roach",
      price: 0.0,
      units: 100
    }
    // {
    //   name: "Pennsylvania wood cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Smokybrown cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Florida woods cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Ectobius vittiventris",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Madagascar hissing cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Japanese cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Brown-banded cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Australian cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Parcoblatta fulvescens",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Blattella asahinai",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Parcoblatta virginica",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Dusky cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Cuban cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Tryonicidae",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Death's head cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Princisia vanwaerebek",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Saltoblattella montistabular",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Lamproblattid",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Ectobius erythronotus",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Speckled cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Brown cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Blaberus giganteus",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Forest cockroach",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Blaberus discoidalis",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Lucihormetica verrucosa",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Asiablatta kyotensis",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Lucihormetica luckae",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Simandoa cave roach",
    //   description: "Gromphadort oblongonota",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Eupolyphaga sinensis",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Nocticolidae",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // },
    // {
    //   name: "Cryptocercus garciai",
    //   description: "Description",
    //   price: 0.0,
    //   units: 100,
    //   imgUrl: "https://www.fillmurray.com/300/300"
    // }
  ];
}
