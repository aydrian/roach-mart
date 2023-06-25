import { type DataFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { Cart, Line, User } from "~/components/icons";
import { GitHub } from "~/components/logos";
import icon from "~/images/icon.png";
import logo from "~/images/logo.png";
import { getUser } from "~/utils/auth.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await getUser(request, {
    cartItems: {
      select: { id: true },
      where: { expiration: { gt: new Date() } }
    },
    id: true,
    username: true
  });

  return { user };
};

export default function StoreLayout() {
  const { user } = useLoaderData<typeof loader>();
  const cartItemCount = user?.cartItems?.length ?? 0;
  return (
    <div className="grid min-h-screen grid-rows-[130px_auto_60px] bg-[#f5f5f5]">
      <header className="grid grid-rows-[90px_40px]">
        <div className="bg-white">
          <div className="container flex h-full flex-col items-center justify-between md:flex-row">
            <img alt="RoachMart" className="h-12 w-auto" src={logo} />
            <div className="flex gap-4">
              <Link className="relative p-0.5" to="/cart">
                <Cart className="inline-block h-6 w-auto text-[#637381]" />
                {cartItemCount > 0 ? (
                  <div className="absolute right-0 top-0 inline-flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#de3618] p-0 text-[0.625rem] font-medium text-white">
                    {cartItemCount}
                  </div>
                ) : null}
              </Link>
              <Line className="h-[30px] w-auto text-[#dde3e7]" />
              <div className="flex items-center gap-3">
                <User className="inline-block h-6 w-auto text-black" />
                {user ? (
                  <Link
                    className="font-medium text-crl-electric-purple"
                    to="/logout"
                  >
                    Logout
                  </Link>
                ) : (
                  <Link
                    className="font-medium text-crl-electric-purple"
                    to="/login"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-crl-dark-blue font-medium text-white">
          <div className="container flex h-full items-center justify-between">
            <Link to="/">Home</Link>
            {user ? <span>Welcome, {user.username}</span> : null}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="flex items-center bg-gradient-to-br from-crl-deep-purple from-45% via-crl-dark-blue to-crl-electric-purple p-2">
        <div className="container flex flex-col items-center justify-between text-xs text-white md:flex-row">
          <div className="flex items-center">
            <img
              alt="RoachMart"
              className="mr-2 inline-block h-[2.125rem]"
              src={icon}
            />{" "}
            © Roach Mart 2022 All Rights Reserved.
          </div>
          <div>
            <a
              href="https://github.com/aydrian/roach-mart"
              rel="noreferrer"
              target="_blank"
            >
              <GitHub className="h-6" title="RoachMart GitHub Repository" />
              <span className="sr-only">RoachMart GitHub Repository</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
