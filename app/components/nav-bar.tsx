import { Link as RemixLink } from "@remix-run/react";
import { Prisma } from "@prisma/client";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { BsCart4 } from "react-icons/bs";

type UserWithCart = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    cartItems: true;
  };
}>;

type NavBarProps = {
  user: UserWithCart;
};

export default function NavBar({ user }: NavBarProps) {
  return (
    <Box bg={useColorModeValue("#C2D5FF", "gray.900")} px="4">
      <Flex h={14} alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Link as={RemixLink} to="/catalog">
            <Text fontWeight="medium">Product Catalog</Text>
          </Link>
        </Box>
        <HStack>
          <Text fontWeight="medium">Welcome, {user.username}</Text>
          <Avatar size={"sm"} name={user.username} />
          <Link as={RemixLink} to="/cart" _hover={{ textDecoration: "none" }}>
            <Tag size="lg" borderRadius="full">
              <TagLeftIcon boxSize="16px" as={BsCart4} />
              {user.cartItems.length > 0 ? (
                <TagLabel>{user.cartItems.length}</TagLabel>
              ) : null}
            </Tag>{" "}
          </Link>
          <form method="post" action="/logout">
            <Button type="submit" size="sm">
              Logout
            </Button>
          </form>
        </HStack>
      </Flex>
    </Box>
  );
}
