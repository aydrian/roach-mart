import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { type DataFunctionArgs, json } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { FormStrategy } from "remix-auth-form";
import { z } from "zod";

import { ErrorList, Field, SubmitButton } from "~/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { authenticator, signUp } from "~/utils/auth.server";
import { redirectToCookie } from "~/utils/cookies.server";
import { prisma } from "~/utils/db.server";

const SignUpFormSchema = z
  .object({
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    username: z.string().min(1, { message: "Username is required" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();
  const submission = await parse(formData, {
    acceptMultipleErrors: () => true,
    async: true,
    schema: () => {
      return SignUpFormSchema.superRefine(async (data, ctx) => {
        const existingUser = await prisma.user.findUnique({
          select: { id: true },
          where: { username: data.username }
        });
        if (existingUser) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A user already exists with this username",
            path: ["username"]
          });
          return;
        }
      });
    }
  });
  if (!submission.value || submission.intent !== "submit") {
    return json(
      {
        status: "error",
        submission
      } as const,
      { status: 400 }
    );
  }

  const { password, username } = submission.value;

  // Create new user
  await signUp(username, password);

  const redirectTo =
    (await redirectToCookie.parse(request.headers.get("Cookie"))) ?? "/catalog";

  // Sign in
  await authenticator.authenticate(FormStrategy.name, request, {
    context: { formData },
    failureRedirect: "/",
    successRedirect: redirectTo
  });

  return json({ status: "success", submission } as const);
};

export const loader = async ({ request }: DataFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/admin/dashboard"
  });
};

export default function SignUp() {
  const signUpFetcher = useFetcher<typeof action>();

  const [form, fields] = useForm({
    constraint: getFieldsetConstraint(SignUpFormSchema),
    id: "form-login-form",
    lastSubmission: signUpFetcher.data?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: SignUpFormSchema });
    },
    shouldRevalidate: "onBlur"
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-crl-deep-purple">Sign up</CardTitle>
      </CardHeader>
      <CardContent>
        <signUpFetcher.Form
          className="mb-8 flex flex-col sm:mb-4"
          method="post"
          {...form.props}
        >
          <Field
            errors={fields.username.errors}
            inputProps={conform.input(fields.username)}
            labelProps={{ children: "Username", htmlFor: fields.username.id }}
          />
          <Field
            errors={fields.password.errors}
            inputProps={conform.input(fields.password, { type: "password" })}
            labelProps={{ children: "Password", htmlFor: fields.password.id }}
          />
          <Field
            inputProps={conform.input(fields.confirmPassword, {
              type: "password"
            })}
            labelProps={{
              children: "Confirm Password",
              htmlFor: fields.confirmPassword.id
            }}
            errors={fields.confirmPassword.errors}
          />
          <ErrorList errors={form.errors} id={form.errorId} />
          <SubmitButton
            className="bg-crl-dark-blue px-6 py-2"
            state={signUpFetcher.state}
            type="submit"
          >
            Sign up
          </SubmitButton>
          <div className="mt-2 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link className="text-crl-electric-purple" to="/">
              Log in
            </Link>
          </div>
        </signUpFetcher.Form>
      </CardContent>
    </Card>
  );
}
