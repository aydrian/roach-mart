import { Outlet } from "@remix-run/react";

import logo from "~/images/logo.png";

export default function AuthLayout() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-8">
      <img alt="Roacher Mart" className="h-24 w-auto" src={logo} />
      <Outlet />
    </main>
  );
}
