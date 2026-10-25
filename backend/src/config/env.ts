import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const postgresUrl = z
  .string()
  .url()
  .refine(
    (value) =>
      value.startsWith('postgresql://') || value.startsWith('postgres://'),
  );
const schema = z.object({
  DATABASE_URL: postgresUrl,
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  SESSION_SECRET: z
    .string()
    .min(32)
    .refine((value) => !value.startsWith('replace-')),
  TZ_DISPLAY: z.literal('Asia/Karachi').default('Asia/Karachi'),
  TEST_DATABASE_URL: postgresUrl.optional(),
});
export type Config = z.infer<typeof schema>;

export function parseEnv(values: NodeJS.ProcessEnv): Config {
  const result = schema.safeParse(values);
  if (!result.success) {
    // Report names only: validator messages may contain sensitive input.
    const fields = [
      ...new Set(result.error.issues.map((issue) => issue.path.join('.'))),
    ];
    throw new Error(
      `Invalid environment configuration: ${fields.join(', ')}. Check .env.example.`,
    );
  }
  return result.data;
}

export function loadConfig(): Config {
  dotenv.config({
    path: fileURLToPath(new URL('../../../.env', import.meta.url)),
    quiet: true,
  });
  return parseEnv(process.env);
}
