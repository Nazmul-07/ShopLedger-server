import express, { type Express, type Request, type Response } from 'express';
import { allRoutes } from './app/routes/index.ts';

const app: Express = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopLedger API is running",
  });
});

app.use('/api/v1', allRoutes)

export default app;