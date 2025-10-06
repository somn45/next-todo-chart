import { MongoClient } from "mongodb";

/* eslint-disable no-var */

declare global {
  namespace globalThis {
    var _mongo: Promise<MongoClient> | undefined;
  }
}
