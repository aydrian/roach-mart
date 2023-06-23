// root.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { withEmotionCache } from "@emotion/react";
import { type LinksFunction, type V2_MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import React, { useContext, useEffect } from "react"; // Depends on the runtime you choose

import { ClientStyleContext, ServerStyleContext } from "./context";
import styles from "./tailwind.css";

export const meta: V2_MetaFunction = () => [
  { charset: "utf-8" },
  { title: "Roach Mart" },
  { viewport: "width=device-width,initial-scale=1" }
];

// export let links: LinksFunction = () => {
//   return [
//     { rel: "preconnect", href: "https://fonts.googleapis.com" },
//     { rel: "preconnect", href: "https://fonts.gstatic.com" },
//     {
//       rel: "stylesheet",
//       href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
//     }
//   ];
// };

export const links: LinksFunction = () => [
  { href: "/fonts/poppins/font.css", rel: "stylesheet" },
  { href: styles, rel: "stylesheet" }
];

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, [clientStyleData, emotionCache.sheet]);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ css, ids, key }) => (
            <style
              dangerouslySetInnerHTML={{ __html: css }}
              data-emotion={`${key} ${ids.join(" ")}`}
              key={key}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <ChakraProvider>
        <Outlet />
      </ChakraProvider>
    </Document>
  );
}
