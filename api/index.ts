import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/index';
import type { Express } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';

let cachedApp: Express | undefined;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  try {
    if (!cachedApp) {
      cachedApp = createApp();
    }

    await new Promise<void>((resolve, reject) => {
      const expressReq = req as unknown as IncomingMessage;
      const expressRes = res as unknown as ServerResponse;

      const expressApp = cachedApp as unknown as (
        req: IncomingMessage,
        res: ServerResponse,
        next?: (err?: Error | null) => void,
      ) => void;

      expressApp(expressReq, expressRes, (err?: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({
      error: message,
      timestamp: new Date().toISOString(),
    });
  }
}
