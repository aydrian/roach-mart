import { Box, Flex } from "@chakra-ui/react";

import Header from "~/components/header";
import NavBar from "~/components/nav-bar";
import Footer from "~/components/footer";
import type { User } from "@prisma/client";

type LayoutProps = {
  user: User;
  children: React.ReactNode;
};

export default function Layout({ children, user }: LayoutProps) {
  return (
    <Flex direction="column" height="100vh">
      <Header />
      <NavBar user={user} />
      <Box as="main" flex="1" p="4">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
}
