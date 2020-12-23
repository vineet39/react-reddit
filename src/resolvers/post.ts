import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    getAllPosts(@Ctx() { em }: MyContext) {
        return em.find(Post, {})
    }
    @Query(() => Post, {nullable: true})
    getPostsByID(@Ctx() { em }: MyContext, @Arg("id") id: number)
    : Promise<Post | null>{
        return em.findOne(Post, { id })
    }
    @Mutation(() => Post)
    async createPost(@Ctx() { em }: MyContext, @Arg("title") title: String)
    : Promise<Post>{
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);
        return post;
    }
}