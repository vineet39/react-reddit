import "reflect-metadata";
import { __prod__, COOKIE_NAME } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import connectRedis from "connect-redis";
import redis from "redis";
import { createConnection } from "typeorm";
import cors from "cors";

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

  const app = express();
  app.use(cors());
  const redisClient = redis.createClient();
  const redisStore = connectRedis(session);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new redisStore({
        host: "localhost",
        port: 4000,
        client: redisClient,
        ttl: 864000,
      }),
      secret: "randomstring",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 100,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    // cors: false,
  });

  app.listen(4000);
};
main().catch((err) => console.log(err));
