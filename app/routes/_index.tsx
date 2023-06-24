import { type DataFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import logo from "~/images/logo.png";
import { authenticator } from "~/utils/auth.server";
import { redirectToCookie } from "~/utils/cookies.server";
import { commitSession, getSession } from "~/utils/session.server";

import { FormLoginForm } from "./auth.form";

export const loader = async ({ request }: DataFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/admin/dashboard"
  });
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo");
  const loginMessage = url.searchParams.get("loginMessage");

  let headers = new Headers();
  if (redirectTo) {
    headers.append("Set-Cookie", await redirectToCookie.serialize(redirectTo));
  }
  const session = await getSession(request.headers.get("cookie"));
  const error = session.get(authenticator.sessionErrorKey);
  let errorMessage: null | string = null;
  if (typeof error?.message === "string") {
    errorMessage = error.message;
  }
  headers.append("Set-Cookie", await commitSession(session));

  return json({ formError: errorMessage, loginMessage }, { headers });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-8">
      <img alt="Roacher Mart" className="h-24 w-auto" src={logo} />
      <Card>
        <CardHeader>
          <CardTitle className="text-crl-deep-purple">Login</CardTitle>
        </CardHeader>
        <CardContent>
          {data.loginMessage ? (
            <div className="text-sm text-red-500">{data.loginMessage}</div>
          ) : null}
          <FormLoginForm formError={data.formError} />
        </CardContent>
      </Card>
    </main>
  );
}
