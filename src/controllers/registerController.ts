import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';

export const register_user = async (req: Request, res: Response) => {
  const { displayName, email, password } = req.body;

  if (!email || !password || !displayName)
    return res
      .status(400)
      .json({ message: 'Display name, email, and password are required.' });

  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      email: email,
      displayName: displayName,
      password: hashedPassword,
    });

    res.status(201).json({ success: `New user ${email} created` });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: message });
  }
};
