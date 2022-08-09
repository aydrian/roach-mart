import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Box, Flex } from "@chakra-ui/react";
import { getUser, requireUserId } from "~/utils/session.server";
import { db } from "~/utils/db.server";

import Header from "~/components/header";
import NavBar from "~/components/nav-bar";
import Footer from "~/components/footer";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const user = await getUser(request);
  const cartItemCount = await db.cartItem.count({
    where: { userId: user?.id, expiration: { gt: new Date() } }
  });

  return { user, cartItemCount };
};

export default function StoreLayout() {
  const { user, cartItemCount } = useLoaderData();
  return (
    <Flex direction="column" height="100vh">
      <Header />
      <NavBar user={user} cartItemCount={cartItemCount} />
      <Box as="main" flex="1" p="4">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
}
