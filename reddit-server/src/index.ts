// import { MikroORM } from "@mikro-orm/core";
import "reflect-metadata";
import { __prod__ } from "./constants";
// import microConfig from "../mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
// import { Post } from "./entities/Post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
// import connectRedis from "connect-redis";
// import { sendEmail } from "./utils/sendEmail";
// import { MyContext } from "./types";
// import Redis from "ioredis";
import {createConnection} from "typeorm";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "appuser",
    password: "apppassword",
    database: "lireddit2",
    synchronize: true,
    entities: [Post, User],
    logging: true,
    
});

  // sendEmail("vinit.bugtani@gmail.com", "hello").catch(console.error);
  // const orm = await MikroORM.init(microConfig);
  // await orm.getMigrator().up();
 
  // const postOne = orm.em.create(Post, { title: "first post" });
  // await orm.em.persistAndFlush(postOne);
  // const postTwo = orm.em.create(Post, { title: "second post" });
  // await orm.em.persistAndFlush(postTwo);

  const app = express();

  // const RedisStore = connectRedis(session);
  // const redis = new Redis();

  app.use(
    session({
      name : 'codeil',
      // store: new RedisStore({ client: redis }),
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
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app });
  // app.get('/', (_, res) => {
  //     res.send("hello");
  // });
  app.listen(4000);
};
main().catch((err) => console.log(err));
