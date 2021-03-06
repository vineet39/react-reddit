import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}
export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [_,logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;
  if (fetching) {
    console.log("navbar.tsx line 12")
  } else {
    console.log("navbar.tsx line 13", data)
    if (!data?.me) {
      body = (
        <>
          <NextLink href="/login">
            <Link mr={2}>login</Link>
          </NextLink>
          <NextLink href="/register">
            <Link mr={2}>register</Link>
          </NextLink>
        </>
      );
    } else {
      body = (
        <Flex>
          <Box mr={2}>{data.me.username}</Box>
          <Button variant="link" onClick={() => {
            logout();
          }}>logout</Button>
        </Flex>
      );
    }
  }
  return (
    <Flex bg="tan" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
