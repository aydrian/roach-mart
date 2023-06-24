import { createCookie } from "@remix-run/node";

export const redirectToCookie = createCookie("redirect-to", {
  httpOnly: true,
  maxAge: 60, // 1 minute because it makes no sense to keep it for a long time
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
});
