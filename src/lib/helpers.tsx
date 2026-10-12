export function getErrorMessage(error: unknown, message: string) {
  return error instanceof Error
    ? error.message
    : message;
}