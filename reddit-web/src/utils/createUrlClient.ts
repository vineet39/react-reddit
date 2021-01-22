import { dedupExchange, fetchExchange, ssrExchange } from "urql";
import { LoginMutation, MeQuery, MeDocument, LogoutMutation } from "../generated/graphql";
import { cacheExchange, query } from '@urql/exchange-graphcache';
import { betterUpdateQuery } from "./betterUpdateQuery";

export const createUrlClient = (ssrExchange: any) => ({
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
      },
      logout: (result, _args, cache, _info) => {
        betterUpdateQuery<LogoutMutation, MeQuery>(
          cache,
          { query: MeDocument},
          result,
          () => ({me: null})
        );
    }
    }
  }
}), ssrExchange, fetchExchange]
})