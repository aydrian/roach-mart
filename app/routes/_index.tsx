import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import  { type DataFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";

import { prisma } from "~/utils/db.server";
import {
  createUserSession,
  getUserId,
  login,
  register
} from "~/utils/session.server";

export const loader= async ({ request }: DataFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/catalog");
  }
  return json({ ok: true });
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
  fieldErrors?: { password: string | undefined; username: string | undefined };
  fields?: { loginType: string; password: string; username: string };
  formError?: string;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action = async ({ request }: DataFunctionArgs) => {
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

  const fields = { loginType, password, username };
  const fieldErrors = {
    password: validatePassword(password),
    username: validateUsername(username)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ password, username });
      if (!user) {
        return badRequest({
          fields,
          formError: `Username/Password combination is incorrect`
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await prisma.user.findFirst({ where: { username } });
      if (userExists) {
        return badRequest({
          fields,
          formError: `User with username ${username} already exists`
        });
      }
      const user = await register({ password, username });
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
  const actionData = useActionData<typeof action>();
  console.log(actionData);
  const [searchParams] = useSearchParams();
  return (
    <Flex
      align={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      justify={"center"}
      minH={"100vh"}
    >
      <Stack maxW={"lg"} mx={"auto"} px={6} py={12} spacing={8}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Welcome to Roach Mart</Heading>
          <Text color={"gray.600"} fontSize={"lg"}>
            Sign in to your account
          </Text>
        </Stack>
        <Box
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          rounded={"lg"}
        >
          <Stack spacing={4}>
            <Form method="post">
              <input
                name="redirectTo"
                type="hidden"
                value={searchParams.get("redirectTo") ?? undefined}
              />
              <FormControl as="fieldset">
                <FormLabel as="legend">Login or Register?</FormLabel>
                <RadioGroup
                  defaultValue={actionData?.fields?.loginType || "login"}
                  name="loginType"
                >
                  <HStack spacing="24px">
                    <Radio value="login">Login</Radio>
                    <Radio value="register">Register</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl
                id="username"
                isInvalid={Boolean(actionData?.fieldErrors?.username)}
                isRequired
              >
                <FormLabel>Username</FormLabel>
                <Input
                  aria-errormessage={
                    actionData?.fieldErrors?.username
                      ? "username-error"
                      : undefined
                  }
                  defaultValue={actionData?.fields?.username}
                  name="username"
                  type="text"
                />
                {actionData?.fieldErrors?.username ? (
                  <FormErrorMessage>
                    {actionData.fieldErrors.username}
                  </FormErrorMessage>
                ) : undefined}
              </FormControl>
              <FormControl
                id="password"
                isInvalid={Boolean(actionData?.fieldErrors?.password)}
                isRequired
              >
                <FormLabel>Password</FormLabel>
                <Input
                  aria-errormessage={
                    actionData?.fieldErrors?.password
                      ? "password-error"
                      : undefined
                  }
                  defaultValue={actionData?.fields?.password}
                  name="password"
                  type="password"
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
                  _hover={{
                    bg: "blue.500"
                  }}
                  bg={"#0037A5"}
                  color={"white"}
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
