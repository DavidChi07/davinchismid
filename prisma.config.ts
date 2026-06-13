import { defineConfig } from 'prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL as string;

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  datasource: {
    url: connectionString,
  },
  migrate: {
    adapter: () => {
      const pool = new Pool({ connectionString });
      return new PrismaPg(pool);
    },
  },
});