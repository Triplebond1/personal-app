export class ServiceError extends Error {
    constructor(
      message: string,
      public statusCode: number,
      public details?: any // Optional for additional error info
    ) {
      super(message);
      this.name = "ServiceError";
      // Ensure proper prototype chain (TypeScript/Node.js requirement)
      Object.setPrototypeOf(this, ServiceError.prototype);
    }
  }