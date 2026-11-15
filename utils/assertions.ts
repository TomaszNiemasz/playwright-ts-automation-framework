import { expect } from '@playwright/test';
import { z } from 'zod';

/**
 * Asserts that `data` matches a Zod schema.
 * On failure the assertion message lists exactly which fields are wrong,
 * instead of the unhelpful "expected true, received false".
 */
export function expectToMatchSchema(schema: z.ZodType, data: unknown): void {
  const result = schema.safeParse(data);
  // Przy porazce powie ktore pole i dlaczego jest zle
  expect(result.success, result.success ? undefined : z.prettifyError(result.error)).toBe(true);
}
