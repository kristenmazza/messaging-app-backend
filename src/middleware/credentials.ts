import { Request, Response, NextFunction } from 'express';
import allowedOrigins from '../setup/allowedOrigins';

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  next();
};

export default credentials;
