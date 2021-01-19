import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [_, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values , { setErrors }) => {
          const response = await register(values);
          if(response.data?.register.errors) {
              // [{field: 'username', message: 'something is wrong'}]
              setErrors(toErrorMap(response.data.register.errors));
          }
          else {
            router.push('/');
          }
        }}
      >
        {() => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Button
            mt={4}
            colorScheme="teal"
            type="submit"
          >
            Submit
          </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default Register;
