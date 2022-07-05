import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  RadioGroup,
  Radio,
  FormErrorMessage
} from "@chakra-ui/react";

import {
  login,
  createUserSession,
  register,
  getUserId
} from "~/utils/session.server";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/catalog");
  }
  return { ok: true };
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

function validateUrl(url: any) {
  let urls = ["/catalog", "/"];
  if (urls.includes(url)) {
    return url;
  }
  return "/catalog";
}

type ActionData = {
  formError?: string;
  fieldErrors?: { username: string | undefined; password: string | undefined };
  fields?: { loginType: string; username: string; password: string };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = validateUrl(form.get("redirectTo") || "/catalog");
  if (
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({ formError: `Form not submitted correctly.` });
  }

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `Username/Password combination is incorrect`
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({ where: { username } });
      if (userExists) {
        return badRequest({
          fields,
          formError: `User with username ${username} already exists`
        });
      }
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `Something went wrong trying to create a new user.`
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({ fields, formError: `Login type invalid` });
    }
  }
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  console.log(actionData);
  const [searchParams] = useSearchParams();
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Welcome to Roach Mart</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Sign in to your account
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <Form method="post">
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get("redirectTo") ?? undefined}
              />
              <FormControl as="fieldset">
                <FormLabel as="legend">Login or Register?</FormLabel>
                <RadioGroup
                  name="loginType"
                  defaultValue={actionData?.fields?.loginType || "login"}
                >
                  <HStack spacing="24px">
                    <Radio value="login">Login</Radio>
                    <Radio value="register">Register</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl
                id="username"
                isRequired
                isInvalid={Boolean(actionData?.fieldErrors?.username)}
              >
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  defaultValue={actionData?.fields?.username}
                  aria-errormessage={
                    actionData?.fieldErrors?.username
                      ? "username-error"
                      : undefined
                  }
                />
                {actionData?.fieldErrors?.username ? (
                  <FormErrorMessage>
                    {actionData.fieldErrors.username}
                  </FormErrorMessage>
                ) : undefined}
              </FormControl>
              <FormControl
                id="password"
                isRequired
                isInvalid={Boolean(actionData?.fieldErrors?.password)}
              >
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  defaultValue={actionData?.fields?.password}
                  aria-errormessage={
                    actionData?.fieldErrors?.password
                      ? "password-error"
                      : undefined
                  }
                />
                {actionData?.fieldErrors?.password ? (
                  <FormErrorMessage>
                    {actionData.fieldErrors.password}
                  </FormErrorMessage>
                ) : undefined}
              </FormControl>
              <Stack spacing={10}>
                {actionData?.formError ? (
                  <FormErrorMessage>{actionData.formError}</FormErrorMessage>
                ) : undefined}
                <Button
                  bg={"#0037A5"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500"
                  }}
                  type="submit"
                >
                  Submit
                </Button>
              </Stack>
            </Form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
