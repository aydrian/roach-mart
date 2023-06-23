import { type DataFunctionArgs, Response } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { Cart, Line } from "~/components/icons";
import icon from "~/images/icon.png";
import logo from "~/images/logo.png";
import { prisma } from "~/utils/db.server";
import { getUser, requireUserId } from "~/utils/session.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  await requireUserId(request);
  const user = await getUser(request);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  const cartItemCount = await prisma.cartItem.count({
    where: { expiration: { gt: new Date() }, userId: user?.id }
  });

  return { cartItemCount, user };
};

export default function StoreLayout() {
  const { cartItemCount, user } = useLoaderData<typeof loader>();
  return (
    <div className="grid min-h-screen grid-rows-[130px_auto_60px]">
      <header className="grid grid-rows-[90px_40px]">
        <div className="bg-white">
          <div className="container flex h-full items-center justify-between">
            <img alt="RoachMart" className="h-12 w-auto" src={logo} />
            <div className="flex gap-4">
              <Link className="relative p-0.5" to="/cart">
                <Cart className="inline-block h-6 w-auto text-[#637381]" />{" "}
                <div className="absolute right-0 top-0 inline-flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#de3618] p-0 text-[0.625rem] font-medium text-white">
                  {cartItemCount}
                </div>
              </Link>
              <Line className="h-[30px] w-auto text-[#dde3e7]" />
              <Link
                className="font-medium text-crl-electric-purple"
                to="/logout"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-crl-dark-blue font-medium text-white">
          <div className="container flex h-full items-center justify-between">
            <Link to="/catalog">Home</Link>
            <span>Welcome, {user.username}</span>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="flex items-center bg-crl-deep-purple">
        <div className="container flex items-center text-xs text-white">
          <img
            alt="RoachMart"
            className="mr-2 inline-block h-[2.125rem]"
            src={icon}
          />{" "}
          © Roach Mart 2022 All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
