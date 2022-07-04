import type { LoaderFunction } from "@remix-run/node";
import type { Product } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { Heading, Stack, VStack } from "@chakra-ui/react";

import Layout from "~/components/layout";
import { ProductCard } from "~/components/product-card";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
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

  return { products, user };
};

export default function CatalogRoute() {
  const { products, user } = useLoaderData();
  const formatCurrency = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });
  return (
    <Layout user={user}>
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
    </Layout>
  );
}
