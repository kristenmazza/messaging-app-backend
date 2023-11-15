import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const handle_refresh_token = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: Error | null, decoded: any) => {
      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
      const accessToken = jwt.sign(
        {
          email: decoded.email,
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '7d' }
      );
      res.json({ accessToken });
    }
  );
};
