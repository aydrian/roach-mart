import { Box, Heading } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box
      as="header"
      w="100%"
      p="4"
      bgGradient="linear(to-r, #0037A5, #6933FF, #00FCED)"
      textAlign="center"
      textColor="whiteAlpha.900"
    >
      <Heading as="h1">🪳 Roach Mart</Heading>
    </Box>
  );
}
