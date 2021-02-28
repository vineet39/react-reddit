import { withUrqlClient } from "next-urql";
import { createUrlClient } from "../utils/createUrlClient";
import { usePostsQuery } from "../generated/graphql";
import React, { useState } from "react";
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Layout } from "../components/Layout";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 2,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables: variables,
  });
  let displayPosts = null;
  if (fetching) {
    displayPosts = <div>Data is being fetched</div>;
  } 
  else {
    if (data) {
      displayPosts = data!.getAllPosts.posts.map((p) => (
        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          key={p.id}
          margin="auto"
          marginTop={10}
        >
          <Heading fontSize="xl">{p.title}</Heading>
          <Text mt={4}>{p.textSnippet}...</Text>
        </Box>
      ));
    } else {
      displayPosts = <div>Data is not available</div>;
    }
  }
  return (
    <Layout>
      <Flex align="center">
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link mr={2} ml="auto">
            create post
          </Link>
        </NextLink>
      </Flex>
      {displayPosts}
      {data ? (
        <Flex>
          <Button m="auto" mt={8} mb={8} isLoading={fetching} onClick={() => {
            setVariables({
              limit : variables.limit,
              cursor: data.getAllPosts.posts[data.getAllPosts.posts.length - 1].createdAt as string
            })
          }}>
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrlClient, { ssr: true })(Index);
