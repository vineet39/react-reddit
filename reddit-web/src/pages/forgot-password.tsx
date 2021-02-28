import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrlClient } from "../utils/createUrlClient";
import { Wrapper } from "../components/Wrapper";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useForgotPasswordMutation } from "../generated/graphql";
import { EmailIcon } from "@chakra-ui/icons";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [_, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="email"
              placeholder="email"
              label="Email"
              type="email"
            />
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantcolor="teal"
            >
              forgot password
            </Button>
          </Form>
        )}
      </Formik>
      {complete && (
        <Box mt={2}>if an account with that email exists, we sent you an email</Box>
      )}
    </Wrapper>
  );
};

export default withUrqlClient(createUrlClient)(ForgotPassword);
