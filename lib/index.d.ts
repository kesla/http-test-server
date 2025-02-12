import { IncomingMessage, ServerResponse } from "http";

/**
 * Custom request type
 */
export type CustomRequest = IncomingMessage & { body: Buffer };

/**
 * Request handler function type
 */
export type RequestHandler = (
  req: CustomRequest,
  res: ServerResponse
) => void | Promise<void>;

/**
 * Server instance returned by the factory function
 */
interface Server {
  /**
   * Shuts down the server
   */
  shutdown: () => Promise<void>;
  /**
   * Base URL of the server (e.g. http://localhost:3000/)
   */
  baseUrl: string;
}

/**
 * Creates an HTTP server with automatic body parsing and shutdown capability
 * @param onRequest Request handler function
 * @returns Promise that resolves to a Server instance
 */
declare function createServer(onRequest: RequestHandler): Promise<Server>;

export = createServer;
