import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "server/prisma/schema.prisma",

  migrations: {
    path: "server/prisma/migrations",
  },

  datasource: {
    url: env("TEST_DATABASE_URL"),
  },
});