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
import { Button, Heading, Text, VStack } from "@chakra-ui/react";

export const meta: MetaFunction = () => {
  return {
    title: "Roach Mart: Cart"
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const items = await db.cartItem.findMany({
    select: { id: true, product: { select: { name: true, price: true } } },
    where: { userId }
  });

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
      <ul>
        {items.map((item: CartItem) => (
          <li key={item.id}>
            <Form method="post" replace>
              <input type="hidden" name="id" value={item.id} />
              {item.product.name}{" "}
              {numFormat.format(item.product.price.toString())}
              <Button type="submit" name="intent" value="deleteItem">
                Delete
              </Button>
            </Form>
          </li>
        ))}
      </ul>
      <Text>Total: {numFormat.format(total.toString())}</Text>
    </VStack>
  );
}
