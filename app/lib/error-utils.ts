// Utility functions for proper error handling in TypeScript

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack
  }
  return undefined
}

export function logError(context: string, error: unknown): void {
  const err = error as Error
  console.error(`❌ ${context}:`, {
    message: getErrorMessage(error),
    stack: getErrorStack(error),
    type: typeof error,
    error: err
  })
}

export function createSafeError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  if (typeof error === 'string') {
    return new Error(error)
  }
  return new Error('An unknown error occurred')
}