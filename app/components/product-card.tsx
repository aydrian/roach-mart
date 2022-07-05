import type { Product } from "@prisma/client";
import { Form } from "@remix-run/react";
import {
  Box,
  Button,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image
} from "@chakra-ui/react";
import { BsCart4 } from "react-icons/bs";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Form method="post" replace>
      <Box
        role={"group"}
        p={6}
        maxW={"278px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${product.imgUrl})`,
            filter: "blur(15px)",
            zIndex: -1
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)"
            }
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={230}
            objectFit={"cover"}
            src={product.imgUrl}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
            {product.name}
          </Heading>
          <Text color={"gray.500"} fontSize={"sm"}>
            {product.description}
          </Text>
          <Stack direction={"row"} align={"center"}>
            <Text fontWeight={800} fontSize={"xl"}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(product.price.toString())}
            </Text>
          </Stack>
        </Stack>
        <input type="hidden" name="id" value={product.id} />
        <Button
          type="submit"
          name="intent"
          value="addToCart"
          leftIcon={<BsCart4 />}
          w={"full"}
          mt={8}
          bg={useColorModeValue("#0037A5", "gray.900")}
          color={"white"}
          rounded={"md"}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg"
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Form>
  );
}
