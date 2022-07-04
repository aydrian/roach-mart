import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";
import { Heading, Stack, VStack } from "@chakra-ui/react";

import Layout from "~/components/layout";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return { user };
};

export default function Cart() {
  const { user } = useLoaderData();
  return (
    <Layout user={user}>
      <VStack spacing="2" textAlign="center">
        <Heading as="h1">Cart</Heading>
      </VStack>
    </Layout>
  );
}
