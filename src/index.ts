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

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();
    const post = orm.em.create(Post, {title: "second post"});
    await orm.em.persistAndFlush(post);
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({ em: orm.em})
    });

    apolloServer.applyMiddleware({app});
    // app.get('/', (_, res) => {
    //     res.send("hello");
    // });
    app.listen(4000);
}
main().catch((err) => console.log(err));