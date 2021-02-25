import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  console.log("isAuth context session", context.req.session);
  if (!context.req.session.userId) {
    console.log("isAuth userId is null", context.req.session.userId);
    throw new Error("not authenticated");
  }

  return next();
};
