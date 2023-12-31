import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const login_user = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser)
      return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      // Create JWTs
      const accessToken = jwt.sign(
        { email: foundUser.email },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '60m' }
      );

      const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '7d' }
      );

      // Saves refreshToken with current user
      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();

      const displayName = foundUser.displayName;
      const id = foundUser._id;

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken, displayName, id });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: message });
  }
};
