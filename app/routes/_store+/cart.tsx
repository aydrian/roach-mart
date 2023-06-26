import type { DataFunctionArgs, V2_MetaFunction } from "@remix-run/node";

import { Prisma } from "@prisma/client";
import { Response, json } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { Fragment } from "react";
import invariant from "tiny-invariant";

import { Cart, Trash } from "~/components/icons";
import { Button } from "~/components/ui/button";
import useCountdownTimer from "~/hooks/use-countdown-timer";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { cn } from "~/utils/misc";

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
  const submit = useSubmit();
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
          <div className="mx-auto max-w-2xl">
            <ul className="grid gap-8 md:gap-4">
              {items.map((item, index) => {
                const {
                  expiration,
                  id,
                  product: { name, price }
                } = item;
                return (
                  <Fragment key={index}>
                    <li className="flex flex-col items-center justify-start gap-4 rounded-sm bg-white p-4 shadow md:flex-row md:justify-between md:gap-6 md:bg-transparent md:shadow-none ">
                      <img
                        alt={item.product.name}
                        className="w-full rounded-sm md:max-w-[8.5rem]"
                        src={item.product.imgUrl}
                      />
                      <div className="flex h-full w-full grow flex-col justify-center">
                        <div>{name}</div>
                        <div className="text-sm text-crl-electric-purple">
                          {numFormat.format(Number(price.toString()))}
                        </div>
                      </div>
                      <div className="flex h-full w-full items-center gap-2 md:justify-center md:border-x md:border-x-gray-300">
                        {expiration ? (
                          <CountDown
                            onEnd={() => {
                              const formData = new FormData();
                              formData.append("intent", "refresh");
                              submit(formData, { method: "post" });
                            }}
                            endDate={expiration}
                          />
                        ) : null}
                      </div>
                      <div className="w-full md:w-auto">
                        <Form className="p-0 md:px-4" method="post" replace>
                          <input name="id" type="hidden" value={id} />
                          <Button
                            aria-label="Delete Item"
                            className="w-full bg-[#d9d9d9] p-1 md:w-auto"
                            name="intent"
                            size="sm"
                            type="submit"
                            value="deleteItem"
                            variant="secondary"
                          >
                            <Trash className="h-6 w-auto" />
                            <span className="ml-1 block text-lg md:hidden">
                              Delete
                            </span>
                          </Button>
                        </Form>
                      </div>
                    </li>
                    <hr className="m-0 hidden md:block" />
                  </Fragment>
                );
              })}
            </ul>
            <div className="flex justify-between p-4 md:p-8">
              <strong>Total</strong>
              <span className="text-sm text-crl-electric-purple">
                {numFormat.format(total)}
              </span>
            </div>
            <hr />
          </div>
        ) : (
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

function CountDown({
  endDate,
  onEnd
}: {
  endDate: Date | string;
  onEnd: Function;
}) {
  const { hours, minutes, remainingMS, seconds } = useCountdownTimer(
    endDate,
    onEnd
  );
  if (remainingMS <= 0) {
    return <span className="text-xs text-[#959ead]">Expired</span>;
  }
  return (
    <span className="text-xs">
      <span className="text-[#959ead]">Expires in </span>
      <span
        className={cn(
          "text-[#555b65]",
          remainingMS < 10 * 60 * 1000 && "text-yellow-600",
          remainingMS < 1 * 60 * 1000 && "text-red-600",
          remainingMS < 10 * 1000 && "animate-pulse"
        )}
      >
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    </span>
  );
}
