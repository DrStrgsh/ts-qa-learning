import { expect as baseExpect } from '@playwright/test'
import { z } from 'zod'

function formatIssues(error: z.ZodError, limit = 5): string {
  return error.issues.slice(0, limit).map((i) => {
    const path = i.path.join('.') || '<root>'

    return `${path}: ${i.message}`
  }).join('\n- ')
}

export const expect = baseExpect.extend({
  toMatchSchema(received: unknown, schema: z.ZodType<unknown>, name?: string) {
    const result = schema.safeParse(received)
    const label = name ?? 'schema'

    if (result.success) {
      return {
        pass: true,
        message: () => `Expected value not to match ${label}`,
      }
    }

    const issues = formatIssues(result.error)

    return {
      pass: false,
      message: () => `Expected value to match ${label}. Issues: ${issues}`,
    }
  }
})

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T = unknown> {
      toMatchSchema(schema: z.ZodType<unknown>, name?: string): R
    }
  }
}

export {}
