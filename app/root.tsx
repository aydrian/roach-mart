// root.tsx
import { type LinksFunction, type V2_MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

import styles from "./tailwind.css";

export const meta: V2_MetaFunction = () => [{ title: "Roach Mart" }];

export const links: LinksFunction = () => [
  { href: "/fonts/poppins/font.css", rel: "stylesheet" },
  { href: styles, rel: "stylesheet" }
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
