import type { DataFunctionArgs,  } from "@remix-run/node";

import { logout } from "~/utils/session.server";

export const action = async ({ request }: DataFunctionArgs) => {
  return logout(request);
};

export const loader = async ({request}: DataFunctionArgs) => {
  return logout(request);
};
