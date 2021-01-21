import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import theme from "../theme";
import { createClient, dedupExchange, fetchExchange, Provider, Query } from 'urql';
import { cacheExchange, QueryInput, Cache, query } from '@urql/exchange-graphcache';
import { LoginMutation, MeDocument, MeQuery } from "../generated/graphql";


function betterUpdateQuery<Result,Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
){
    return cache.updateQuery(qi,(data) => fn(result, data as any) as any);
}
const client = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            { query: MeDocument},
            result,
            (result, query) => {
              if(result.login.errors){
                return query;
              }
              else{ 
                return{
                  me: result.login.user
                } 
              }
            }
          );
      }
    }
  }
}), fetchExchange]
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
