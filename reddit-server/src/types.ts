import { Request, Response } from "express";
import Redis from "ioredis";

export type MyContext = {
  redis: Redis.Redis;
  req: Request & { session: Express.Session };
  res: Response;
};
