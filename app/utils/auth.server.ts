import { type User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";

import { prisma } from "~/utils/db.server";
import { sessionStorage } from "~/utils/session.server";

export const authenticator = new Authenticator<string>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("username");
    const password = form.get("password");

    invariant(typeof username === "string", "username must be a string");
    invariant(typeof password === "string", "password must be a string");

    const user = await verifyLogin(username, password);
    if (!user) {
      throw new AuthorizationError(
        "Username/Password combination is incorrect"
      );
    }
    return user.id;
  }),
  FormStrategy.name
);

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const searchParams = new URLSearchParams([
    ["redirectTo", redirectTo],
    ["loginMessage", "Please login to continue"]
  ]);
  const userId = await authenticator.isAuthenticated(request, {
    failureRedirect: `/admin?${searchParams}`
  });
  return userId;
};

export async function verifyLogin(
  username: User["username"],
  password: string
) {
  const userWithPassword = await prisma.user.findUnique({
    select: { id: true, password: { select: { hash: true } } },
    where: { username }
  });

  if (!userWithPassword || !userWithPassword.password?.hash) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  return { id: userWithPassword.id };
}

export async function signUp(username: User["username"], password: string) {
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      password: {
        create: { hash }
      },
      username
    },
    select: { id: true }
  });

  return { id: user.id };
}
