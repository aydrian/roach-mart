import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Response } from "@remix-run/node";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";
import {
  Heading,
  IconButton,
  Image,
  Text,
  VStack,
  TableContainer,
  Table,
  Tbody,
  Th,
  Tr,
  Td,
  Tfoot
} from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";

type CartItemWithProduct = Prisma.CartItemGetPayload<{
  select: {
    id: true;
    product: {
      select: {
        name: true;
        price: true;
        imgUrl: true;
      };
    };
  };
}>;

export const meta: MetaFunction = () => {
  return {
    title: "Roach Mart: Cart"
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const items = await db.cartItem.findMany({
    select: {
      id: true,
      product: { select: { name: true, price: true, imgUrl: true } }
    },
    where: { userId },
    orderBy: { createdAt: "asc" }
  });

  // const groupedItems = await db.cartItem.groupBy({
  //   by: ["productId"],
  //   _count: {
  //     productId: true
  //   }
  // });
  // console.log(groupedItems);

  const total = items.reduce(
    (partialTotal, a) => Prisma.Decimal.add(partialTotal, a.product.price),
    new Prisma.Decimal(0)
  );

  return { items, total };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const intent = await form.get("intent");

  if (intent === "deleteItem") {
    const id = form.get("id");
    invariant(typeof id === "string", `id must be a string`);

    await db.cartItem.delete({ where: { id } });

    return new Response(null, { status: 204 });
  }

  return { message: "ok" };
};

export default function Cart() {
  const { items, total } = useLoaderData();
  const numFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });
  return (
    <VStack spacing="2" textAlign="center">
      <Heading as="h1">Cart</Heading>
      <TableContainer>
        <Table variant="simple" size="sm" minWidth="75%">
          <Tbody>
            {items.map((item: CartItemWithProduct) => (
              <Tr key={item.id}>
                <Td>
                  <Image
                    rounded={"lg"}
                    height={50}
                    width={50}
                    objectFit={"cover"}
                    src={item.product.imgUrl}
                  />
                </Td>
                <Td>{item.product.name}</Td>
                <Td>
                  {numFormat.format(Number(item.product.price.toString()))}
                </Td>
                <Td>
                  <Form method="post" replace>
                    <input type="hidden" name="id" value={item.id} />
                    <IconButton
                      aria-label="Delete Item"
                      type="submit"
                      name="intent"
                      value="deleteItem"
                      icon={<BsTrash />}
                      size="sm"
                    />
                  </Form>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Th>{}</Th>
            <Th>Total</Th>
            <Th>{numFormat.format(total.toString())}</Th>
            <Th>{}</Th>
          </Tfoot>
        </Table>
      </TableContainer>
    </VStack>
  );
}
