import type {
  ActionFunction,
  DataFunctionArgs,
  V2_MetaFunction
} from "@remix-run/node";

import {
  Heading,
  IconButton,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Tr,
  VStack
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { Response } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { BsTrash } from "react-icons/bs";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";

import { CountdownTimer } from "~/components/countdown-timer";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";

// type CartItemWithProduct = Prisma.CartItemGetPayload<{
//   select: {
//     id: true;
//     product: {
//       select: {
//         id: true;
//         name: true;
//         price: true;
//         imgUrl: true;
//       };
//     };
//   };
// }>;

// type GroupedProduct = Prisma.ProductGetPayload<{
//   select: {
//     id: true;
//     name: true;
//     price: true;
//     imgUrl: true;
//     _count: true;
//   };
// }>;

export const meta: V2_MetaFunction = () => {
  return [{ title: "Roach Mart: Cart" }];
};

export const loader = async ({ request }: DataFunctionArgs) => {
  const userId = await requireUserId(request);

  const items = await prisma.cartItem.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      expiration: true,
      id: true,
      product: {
        select: { imgUrl: true, name: true, price: true }
      },
      productId: true
    },
    where: { expiration: { gt: new Date() }, userId }
  });

  // const groupedItems = await prisma.cartItem.groupBy({
  //   by: ["productId"],
  //   _count: {
  //     productId: true
  //   }
  // });
  // console.log(groupedItems);

  // const groupedItems = await prisma.product.groupBy({
  //   by: ["id", "name", "price", "imgUrl"],
  //   where: {
  //     CartItem: { some: { userId } }
  //   },
  //   _count: { _all: true },
  //   _sum: { price: true }
  // });
  // console.log(groupedItems);

  const total = items.reduce(
    (partialTotal, a) => Prisma.Decimal.add(partialTotal, a.product.price),
    new Prisma.Decimal(0)
  );

  // return { items, groupedItems, total };
  return typedjson({ items, total: total.toNumber() });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const intent = await form.get("intent");

  if (intent === "deleteItem") {
    const id = form.get("id");
    invariant(typeof id === "string", `id must be a string`);

    await prisma.cartItem.delete({ where: { id } });

    return new Response(null, { status: 204 });
  }
  // } else if (intent == "deleteOldest") {
  //   const userId = await requireUserId(request);
  //   const productId = form.get("productId");
  //   invariant(typeof productId === "string", `productId must be a string`);

  //   const item = await prisma.cartItem.findFirst({
  //     select: { id: true },
  //     where: {
  //       userId,
  //       productId
  //     },
  //     orderBy: { createdAt: "asc" }
  //   });
  //   invariant(typeof item.id === "string", `cartItem.id must be a string`);

  //   await prisma.cartItem.delete({ where: { id: item.id } });
  //   return new Response(null, { status: 204 });
  // }

  return { message: "ok" };
};

export default function Cart() {
  //const { items, groupedItems, total } = useLoaderData();
  const { items, total } = useTypedLoaderData<typeof loader>();
  const numFormat = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency"
  });
  return (
    <VStack spacing="2" textAlign="center">
      <Heading as="h1">Cart</Heading>
      <TableContainer>
        <Table minWidth="75%" size="sm" variant="simple">
          <Tbody>
            {items.map((item) => (
              // groupedItems.map((item: GroupedProduct) => (
              <Tr key={item.id}>
                <Td>
                  <Image
                    height={50}
                    objectFit={"cover"}
                    rounded={"lg"}
                    src={item.product.imgUrl}
                    width={50}
                  />
                </Td>
                <Td>{item.product.name}</Td>
                {/* <Td>{item._count._all}</Td> */}
                <Td>
                  {numFormat.format(Number(item.product.price.toString()))}
                </Td>
                <Td>
                  Expires in{" "}
                  <CountdownTimer targetDate={item.expiration || new Date()} />
                </Td>
                <Td>
                  <Form method="post" replace>
                    <input name="id" type="hidden" value={item.id} />
                    <input
                      name="productId"
                      type="hidden"
                      value={item.productId}
                    />
                    <IconButton
                      aria-label="Delete Item"
                      icon={<BsTrash />}
                      name="intent"
                      size="sm"
                      type="submit"
                      value="deleteItem"
                    />
                  </Form>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Th>{}</Th>
            {/* <Th>{}</Th> */}
            <Th>Total</Th>
            <Th>{numFormat.format(total)}</Th>
            <Th>{}</Th>
            <Th>{}</Th>
          </Tfoot>
        </Table>
      </TableContainer>
    </VStack>
  );
}
