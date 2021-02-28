import React, { useEffect } from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrlClient } from "../utils/createUrlClient";
import NextLink from "next/link";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  useEffect(() => {
    console.log("login.tsx router.query.next ", router.query.next)
  });
  const router = useRouter();
  const [_, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (typeof router.query.next === "string") {
            router.push(router.query.next);
          } else {
            router.push("/");
          }
        }}
      >
        {() => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="Username or Email"
              placeholder="usernameOrEmail"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml="auto">forgot password?</Link>
              </NextLink>
            </Flex>
            <Button mt={4} colorScheme="teal" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createUrlClient)(Login);
