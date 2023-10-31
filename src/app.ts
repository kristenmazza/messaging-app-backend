import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import dotenv from 'dotenv';
import initializeMongoDB from './setup/mongoConfig';

dotenv.config();

const port = process.env.PORT || 3000;
const app: Application = express();

initializeMongoDB();

// Initialize middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello');
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

export default app;
