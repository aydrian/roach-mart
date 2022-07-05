import { Box } from "@chakra-ui/react";

export default function Footer() {
  const date = new Date();

  return (
    <Box
      as="footer"
      w="100%"
      p="4"
      bgColor="#0037A5"
      textAlign="center"
      textColor="whiteAlpha.900"
    >
      <p>© Roach Mart {date.getFullYear()} All Rights Reserved.</p>
    </Box>
  );
}
