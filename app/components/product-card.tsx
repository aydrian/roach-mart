import type { Product } from "@prisma/client";

import {
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { Form } from "@remix-run/react";
import { BsCart4 } from "react-icons/bs";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Form method="post" replace>
      <Box
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        maxW={"278px"}
        p={6}
        pos={"relative"}
        role={"group"}
        rounded={"lg"}
        w={"full"}
        zIndex={1}
      >
        <Box
          _after={{
            backgroundImage: `url(${product.imgUrl})`,
            content: '""',
            filter: "blur(15px)",
            h: "full",
            left: 0,
            pos: "absolute",
            top: 5,
            transition: "all .3s ease",
            w: "full",
            zIndex: -1
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)"
            }
          }}
          height={"230px"}
          mt={-12}
          pos={"relative"}
          rounded={"lg"}
        >
          <Image
            height={230}
            objectFit={"cover"}
            rounded={"lg"}
            src={product.imgUrl}
            width={230}
          />
        </Box>
        <Stack align={"center"} pt={10}>
          <Heading fontFamily={"body"} fontSize={"2xl"} fontWeight={500}>
            {product.name}
          </Heading>
          <Text color={"gray.500"} fontSize={"sm"}>
            {product.description}
          </Text>
          <Stack align={"center"} direction={"row"}>
            <Text fontSize={"xl"} fontWeight={800}>
              {new Intl.NumberFormat("en-US", {
                currency: "USD",
                style: "currency"
              }).format(Number(product.price.toString()))}
            </Text>
          </Stack>
        </Stack>
        <input name="id" type="hidden" value={product.id} />
        <input name="name" type="hidden" value={product.name} />
        <input name="price" type="hidden" value={product.price.toString()} />
        <input name="imgUrl" type="hidden" value={product.imgUrl} />
        <Button
          _hover={{
            boxShadow: "lg",
            transform: "translateY(-2px)"
          }}
          bg={useColorModeValue("#0037A5", "gray.900")}
          color={"white"}
          leftIcon={<BsCart4 />}
          mt={8}
          name="intent"
          rounded={"md"}
          type="submit"
          value="addToCart"
          w={"full"}
        >
          Add to Cart
        </Button>
      </Box>
    </Form>
  );
}
