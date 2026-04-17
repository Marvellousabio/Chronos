import { defineConfig } from "@prisma/cli";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrate: {
    --apply: true,
  },
});
