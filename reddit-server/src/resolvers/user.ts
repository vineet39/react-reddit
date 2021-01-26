import { User } from "../entities/User";
import {
  Field,
  Resolver,
  Arg,
  Ctx,
  InputType,
  Mutation,
  ObjectType, Query
} from "type-graphql";
import { MyContext } from "../types";
import * as argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true})
  async me(@Ctx() { em, req }: MyContext){
    console.log('Session data in me', req.session.userId);
    if(!req.session.userId){
      return null;
    }
    const userFromDB = await em.findOne(User, { id: req.session.userId });
    return userFromDB;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ) {
    const userFromDB = await em.findOne(User, { username: options.username });
    if (options.username.length == 0) {
      return {
        errors: [
          {
            field: "username",
            message: "Username is required",
          },
        ],
      };
    }
    if (options.password.length == 0) {
      return {
        errors: [
          {
            field: "password",
            message: "Password is required",
          },
        ],
      };
    }
    if (userFromDB != null) {
      return {
        errors: [
          {
            field: "username",
            message: "Username already exists",
          },
        ],
      };
    }
    if (options.password.length < 5 && options.password.length > 0) {
      return {
        errors: [
          {
            field: "password",
            message: "Min length of password is 5 characters.",
          },
        ],
      };
    } 
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    req.session.userId = user.id;
    console.log('Session data', req.session.userId);
    return { user: user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em, req}: MyContext
  ) {
    const user = await em.findOne(User, { username: options.username });
    if (user == null) {
      return {
        errors: [
          {
            field: "username",
            message: "Username does not exist",
          },
        ],
      };
    }
    const passwordIsValid = await argon2.verify(
      user.password,
      options.password
    );
    if (!passwordIsValid) {
      return {
        errors: [
          {
            field: "password",
            message: "Invalid password",
          },
        ],
      };
    }
    
    req.session.userId = user.id;
    console.log('Session data', req.session.userId);
    return { user: user };
  }
  @Mutation(() => Boolean)
  logout(@Ctx() { req }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err: any) => {
        // res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
