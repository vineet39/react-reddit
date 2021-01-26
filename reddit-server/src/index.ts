import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "../mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import "reflect-metadata";
import { PostResolver } from "./resolvers/post";
// import { Post } from "./entities/Post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { sendEmail } from "./utils/sendEmail";
// import { MyContext } from "./types";

const main = async () => {
  sendEmail("vinit.bugtani@gmail.com", "hello")
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  // const postOne = orm.em.create(Post, { title: "first post" });
  // await orm.em.persistAndFlush(postOne);
  // const postTwo = orm.em.create(Post, { title: "second post" });
  // await orm.em.persistAndFlush(postTwo);

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name : 'codeil',
      store: new RedisStore({ client: redisClient }),
      secret: "randomstring",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge:(1000 * 60 * 100),
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
