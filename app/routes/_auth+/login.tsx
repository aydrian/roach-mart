import { type DataFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { authenticator } from "~/utils/auth.server";
import { redirectToCookie } from "~/utils/cookies.server";
import { commitSession, getSession } from "~/utils/session.server";

import { FormLoginForm } from "../auth.form";

export const loader = async ({ request }: DataFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/"
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

export default function Login() {
  const data = useLoaderData<typeof loader>();
  return (
    <Card className="w-3/4">
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
  );
}
