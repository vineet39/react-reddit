import { Post } from "../entities/Post";
import {
  Arg,
  Mutation,
  Query,
  Resolver,
  InputType,
  Field,
  Ctx,
  Int,
  FieldResolver,
  Root, ObjectType
} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
export class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @Query(() => PaginatedPosts)
  async getAllPosts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    console.log(limit);
    console.log(cursor);
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimitPlusOne);
    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    }

    const posts = await qb.getMany();
    console.log('posts.length ',posts.length)
    console.log('realLimitPlusOne ',realLimitPlusOne)
    return { posts: posts.slice(0, realLimit), hasMore: posts.length === realLimitPlusOne }
  }
  @Query(() => Post, { nullable: true })
  getPostsByID(@Arg("id") id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }
  @Mutation(() => Post)
  // @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    console.log("new post.ts createpost query session", req.session);
    // if (!req.session.userId) {
    //   console.log("heererererere");
    //   throw new Error("not authenticated");
    // }
    return Post.create({
      ...input,
      creatorId: 1,
    }).save();
  }
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("id") id: number
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await Post.update({ id }, { title });
    }
    return post;
  }
  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }
}
