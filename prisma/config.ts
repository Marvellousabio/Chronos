import { defineConfig } from "@prisma/cli";

export default defineConfig({
  datamodel: "./prisma/schema.prisma",
  migratesDir: "./prisma/migrations",
});
