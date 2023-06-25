import { Outlet } from "@remix-run/react";

import { GitHub } from "~/components/logos";
import logo from "~/images/logo.png";

export default function AuthLayout() {
  return (
    <main className="flex h-screen flex-col justify-evenly bg-[#f5f5f5] md:flex-row">
      <div className="flex basis-1/4 flex-col items-center justify-center gap-2 md:basis-1/2">
        <img alt="Roacher Mart" className="h-auto w-3/4" src={logo} />
        <h1 className="w-3/4 text-center font-poppins text-2xl font-semibold leading-tight text-crl-electric-purple md:text-4xl">
          Shop fast, find anything, thrive everywhere
        </h1>
      </div>
      <div className="flex basis-3/4 items-start justify-center bg-gradient-to-br from-crl-deep-purple from-45% via-crl-dark-blue to-crl-electric-purple  pt-12 md:basis-1/2 md:items-center md:pt-0">
        <Outlet />
      </div>
      <a
        className="absolute bottom-4 right-4"
        href="https://github.com/aydrian/roach-mart"
        rel="noreferrer"
        target="_blank"
      >
        <GitHub className="h-8" title="RoachMart GitHub Repository" />
        <span className="sr-only">RoachMart GitHub Repository</span>
      </a>
    </main>
  );
}
