import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { Product } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";
import { Heading, Stack, VStack } from "@chakra-ui/react";

import { ProductCard } from "~/components/product-card";

export const loader: LoaderFunction = async () => {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      units: true,
      imgUrl: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  return { products };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();

  const intent = await form.get("intent");

  if (intent === "addToCart") {
    const id = form.get("id");

    // insert into cart items table.
  }

  return "ok";
};

export default function CatalogRoute() {
  const { products } = useLoaderData();
  return (
    <>
      <VStack spacing="2" textAlign="center">
        <Heading as="h1">Products</Heading>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        {products.map((product: Product) => {
          return <ProductCard product={product} key={product.id} />;
        })}
      </Stack>
    </>
  );
}
