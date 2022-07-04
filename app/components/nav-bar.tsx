import { Link as RemixLink } from "@remix-run/react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { BsCart4 } from "react-icons/bs";
import type { User } from "@prisma/client";

type NavBarProps = {
  user: User;
};

export default function NavBar({ user }: NavBarProps) {
  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px="4">
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Link as={RemixLink} to="/">
            <Text fontWeight="medium">Roach Mart</Text>
          </Link>
        </Box>
        <HStack>
          <Link as={RemixLink} to="/cart">
            <Icon as={BsCart4} />
          </Link>
          <Text fontWeight="light">Welcome, {user.username}</Text>
          <Avatar size={"sm"} name={user.username} />
          <form method="post" action="/logout">
            <Button type="submit">Logout</Button>
          </form>
        </HStack>
      </Flex>
    </Box>
  );
}
