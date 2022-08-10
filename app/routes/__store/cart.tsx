import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from "@remix-run/node";
import type { CartItem } from "@prisma/client";
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
import { CountdownTimer } from "~/components/countdown-timer";

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
      productId: true,
      productName: true,
      productPrice: true,
      productImgUrl: true,
      expiration: true
      // product: { select: { id: true, name: true, price: true, imgUrl: true } }
    },
    where: { userId, expiration: { gt: new Date() } },
    orderBy: { createdAt: "asc" }
  });

  // const groupedItems = await db.cartItem.groupBy({
  //   by: ["productId"],
  //   _count: {
  //     productId: true
  //   }
  // });
  // console.log(groupedItems);

  // const groupedItems = await db.product.groupBy({
  //   by: ["id", "name", "price", "imgUrl"],
  //   where: {
  //     CartItem: { some: { userId } }
  //   },
  //   _count: { _all: true },
  //   _sum: { price: true }
  // });
  // console.log(groupedItems);

  const total = items.reduce(
    (partialTotal, a) => Prisma.Decimal.add(partialTotal, a.productPrice),
    new Prisma.Decimal(0)
  );

  // return { items, groupedItems, total };
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
  // } else if (intent == "deleteOldest") {
  //   const userId = await requireUserId(request);
  //   const productId = form.get("productId");
  //   invariant(typeof productId === "string", `productId must be a string`);

  //   const item = await db.cartItem.findFirst({
  //     select: { id: true },
  //     where: {
  //       userId,
  //       productId
  //     },
  //     orderBy: { createdAt: "asc" }
  //   });
  //   invariant(typeof item.id === "string", `cartItem.id must be a string`);

  //   await db.cartItem.delete({ where: { id: item.id } });
  //   return new Response(null, { status: 204 });
  // }

  return { message: "ok" };
};

export default function Cart() {
  //const { items, groupedItems, total } = useLoaderData();
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
            {items.map((item: CartItem /*CartItemWithProduct*/) => (
              // groupedItems.map((item: GroupedProduct) => (
              <Tr key={item.id}>
                <Td>
                  <Image
                    rounded={"lg"}
                    height={50}
                    width={50}
                    objectFit={"cover"}
                    src={item.productImgUrl}
                  />
                </Td>
                <Td>{item.productName}</Td>
                {/* <Td>{item._count._all}</Td> */}
                <Td>
                  {numFormat.format(Number(item.productPrice.toString()))}
                </Td>
                <Td>
                  Expires in{" "}
                  <CountdownTimer targetDate={item.expiration || new Date()} />
                </Td>
                <Td>
                  <Form method="post" replace>
                    <input type="hidden" name="id" value={item.id} />
                    <input
                      type="hidden"
                      name="productId"
                      value={item.productId}
                    />
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
            {/* <Th>{}</Th> */}
            <Th>Total</Th>
            <Th>{numFormat.format(total.toString())}</Th>
            <Th>{}</Th>
            <Th>{}</Th>
          </Tfoot>
        </Table>
      </TableContainer>
    </VStack>
  );
}
