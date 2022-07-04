import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Box, Flex } from "@chakra-ui/react";
import { getUser } from "~/utils/session.server";

import Header from "~/components/header";
import NavBar from "~/components/nav-bar";
import Footer from "~/components/footer";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return { user };
};

export default function StoreLayout() {
  const { user } = useLoaderData();
  return (
    <Flex direction="column" height="100vh">
      <Header />
      <NavBar user={user} />
      <Box as="main" flex="1" p="4">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
}
