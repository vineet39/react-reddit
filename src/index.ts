import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "../mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import "reflect-metadata";
import { PostResolver } from "./resolvers/post";
import { Post } from "./entities/Post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
// import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const post = orm.em.create(Post, { title: "second post" });
  await orm.em.persistAndFlush(post);

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: "randomstring",
      resave: false,
      cookie: {
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });
  // app.get('/', (_, res) => {
  //     res.send("hello");
  // });
  app.listen(4000);
};
main().catch((err) => console.log(err));
