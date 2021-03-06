import { __prod__ } from "./src/constants";
import { Post } from "./src/entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./src/entities/User";
// import path from "path";

export default {
  migrations: {
    // path: path.join(__dirname, "./migrations"),
    path: "./migrations",
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "lireddit",
  type: "postgresql",
  debug: !__prod__,
  user: "appuser",
  password: "apppassword",
} as Parameters<typeof MikroORM.init>[0];
