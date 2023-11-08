import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface IGetUserAuthInfoRequest extends Request {
  user: any;
}

interface JwtPayload {
  email?: string;
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader =
    req.headers.authorization || (req.headers.Authorization as string);

  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) return res.sendStatus(403); // Invalid token

      if (decoded) {
        (req as IGetUserAuthInfoRequest).user = (decoded as JwtPayload).email;
      }

      next();
    }
  );
};

export default verifyJWT;
