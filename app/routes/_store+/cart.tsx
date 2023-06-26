import type { DataFunctionArgs, V2_MetaFunction } from "@remix-run/node";

import { Prisma } from "@prisma/client";
import { Response, json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { CountdownTimer } from "~/components/countdown-timer";
import { Cart, Trash } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow
} from "~/components/ui/table";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { Fragment } from "react";

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

  const total = items.reduce(
    (partialTotal, a) =>
      Prisma.Decimal.add(partialTotal, a.product.price).toNumber(),
    0
  );

  return json({ items, total: total });
};

export const action = async ({ request }: DataFunctionArgs) => {
  const form = await request.formData();

  const intent = await form.get("intent");

  if (intent === "deleteItem") {
    const id = form.get("id");
    invariant(typeof id === "string", `id must be a string`);

    await prisma.cartItem.delete({ where: { id } });

    return new Response(null, { status: 204 });
  }

  return json({ message: "ok" });
};

export default function ShoppingCart() {
  const { items, total } = useLoaderData<typeof loader>();
  const numFormat = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency"
  });
  return (
    <>
      <div className="bg-gradient-to-br from-crl-deep-purple from-45% via-crl-dark-blue to-crl-electric-purple">
        <div className="container mx-auto max-w-4xl py-8">
          <h1 className="text-center font-poppins text-4xl font-semibold leading-tight text-white">
            Shopping Cart
          </h1>
        </div>
      </div>
      <div className="container h-full w-full bg-[url('/images/bg-texture.svg')] bg-auto bg-left-top bg-no-repeat py-10">
        {items.length > 0 ? (
          <div className=" mx-auto max-w-5xl">
            <ul className=" grid gap-8 lg:gap-4">
              {items.map((item, index) => {
                const {
                  id,
                  product: { name, price },
                  expiration
                } = item;
                return (
                  <Fragment key={index}>
                    <li className="flex flex-col items-center justify-start gap-4 rounded-sm bg-white p-4 shadow md:justify-between lg:flex-row lg:gap-6 lg:bg-transparent lg:shadow-none ">
                      <img
                        alt={item.product.name}
                        className="w-full rounded-sm lg:max-w-[160px]"
                        src={item.product.imgUrl}
                      />
                      <div className="flex h-full w-full grow flex-col justify-center">
                        <div>{name}</div>
                        <div className="text-sm text-crl-electric-purple">
                          {numFormat.format(Number(price.toString()))}
                        </div>
                      </div>
                      <div className="flex h-full w-full items-center gap-2 lg:justify-center lg:border-x lg:border-x-gray-300">
                        Expires in{" "}
                        <CountdownTimer
                          targetDate={
                            expiration ? new Date(expiration) : new Date()
                          }
                        />
                      </div>
                      <div className="w-full lg:w-auto">
                        <Form className="p-0 lg:px-8" method="post" replace>
                          <input name="id" type="hidden" value={id} />
                          <Button
                            aria-label="Delete Item"
                            className="w-full bg-[#d9d9d9] p-1 lg:w-auto"
                            name="intent"
                            size="sm"
                            type="submit"
                            value="deleteItem"
                            variant="secondary"
                          >
                            <Trash className="h-6 w-auto" />
                            <span className="block lg:hidden">Delete</span>
                          </Button>
                        </Form>
                      </div>
                    </li>
                    <hr className="m-0 hidden lg:block" />
                  </Fragment>
                );
              })}
            </ul>
            <div className="flex justify-between p-4 lg:p-8">
              <strong>Total</strong>
              <span className="text-sm text-crl-electric-purple">
                {numFormat.format(total)}
              </span>
            </div>
            <hr />
          </div>
        ) : (
          // <Table className="mx-auto mb-10 max-w-4xl border-separate border-spacing-x-0 border-spacing-y-8">
          //   <TableBody>
          //     {items.map((item) => (
          //       <TableRow className="p-2" key={item.id}>
          //         <TableCell className="p-2">
          //           <img
          //             alt={item.product.name}
          //             className="h-24 w-auto rounded-sm"
          //             src={item.product.imgUrl}
          //           />
          //         </TableCell>
          //         <TableCell className="p-2 font-medium">
          //           <div>{item.product.name}</div>
          //           <div className="text-sm text-crl-electric-purple">
          //             {numFormat.format(Number(item.product.price.toString()))}
          //           </div>
          //         </TableCell>
          //         <TableCell className="border-x p-2 text-center text-sm text-[#959ead]">
          //           Expires in{" "}
          //           <CountdownTimer
          //             targetDate={
          //               item.expiration ? new Date(item.expiration) : new Date()
          //             }
          //           />
          //         </TableCell>
          //         <TableCell className="p-2">
          //           <Form className="flex justify-center" method="post" replace>
          //             <input name="id" type="hidden" value={item.id} />
          //             <Button
          //               aria-label="Delete Item"
          //               className="bg-[#d9d9d9] p-1"
          //               name="intent"
          //               size="sm"
          //               type="submit"
          //               value="deleteItem"
          //               variant="secondary"
          //             >
          //               <Trash className="h-6 w-auto" />
          //               <span className="sr-only">Delete</span>
          //             </Button>
          //           </Form>
          //         </TableCell>
          //       </TableRow>
          //     ))}
          //   </TableBody>
          //   <TableFooter className="bg-transparent">
          //     <TableRow className="border-t">
          //       <TableCell className="text-black">Total</TableCell>
          //       <TableCell />
          //       <TableCell />
          //       <TableCell className="text-right text-crl-electric-purple">
          //         {numFormat.format(total)}
          //       </TableCell>
          //     </TableRow>
          //   </TableFooter>
          // </Table>
          <div className="flex h-full w-full flex-col items-center gap-1.5">
            <Cart className="h-16 w-auto text-[#637381]" />
            <h2 className="text-center font-poppins text-2xl font-semibold text-crl-deep-purple">
              Your cart is empty.
            </h2>
            <Link className="font-medium text-crl-electric-purple" to="/">
              Keep Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
