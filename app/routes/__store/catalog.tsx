import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from "@remix-run/node";
import type { Product } from "@prisma/client";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";
import { Heading, Stack, VStack } from "@chakra-ui/react";

import { ProductCard } from "~/components/product-card";

export const meta: MetaFunction = () => {
  return {
    title: "Roach Mart: Catalog"
  };
};

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
    const productId = form.get("id")?.toString();

    if (!productId) {
      return json({ message: "product not specified" }, { status: 400 });
    }

    await db.cartItem.create({ data: { productId, userId } });
    return json("Created", { status: 201 });
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
