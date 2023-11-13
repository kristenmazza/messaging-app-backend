import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../models/user';
import mongoose from 'mongoose';

export const user_detail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let user;
    try {
      if (!mongoose.isValidObjectId(req.params.userId)) {
        res.status(404).json({ message: 'Cannot find user' });
      }

      user = await User.findById(req.params.userId);

      if (user === null) {
        res.status(404).json({ message: 'Cannot find user' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message });
    }

    res.send(user);
  }
);

export const user_update = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let user;
    let email = req.body.email;
    try {
      user = await User.findOne({ email });

      if (user === null) {
        res.status(404).json({ message: 'Cannot find user' });
      } else {
        await user.updateOne({ displayName: req.body.displayName });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message });
    }

    res.status(200).json({ success: `Display name updated successfully` });
  }
);
