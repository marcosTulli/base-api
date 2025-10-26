import express, { Express } from 'express';

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'API is running'
    });
  });

  return app;
}
