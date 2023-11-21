import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Message } from '../models/message';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import { Channel } from '../models/channel';

// Get messsage details
export const message_detail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let userMessage;
    try {
      if (!mongoose.isValidObjectId(req.params.messageId)) {
        res.status(404).json({ message: 'Invalid messageId' });
      }

      userMessage = await Message.findById(req.params.messageId).populate(
        'user'
      );

      if (userMessage === null) {
        res.status(404).json({ message: 'Cannot find message' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message });
    }

    res.send(userMessage);
  }
);

// Get list of messages
export const message_list = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let conversation;
    try {
      if (!mongoose.isValidObjectId(req.params.channelId)) {
        res.status(404).json({ message: 'Invalid channelId' });
      }

      const channel = await Channel.findById(req.params.channelId).populate(
        'participants'
      );

      if (!channel) {
        res.status(404).json({ message: 'Channel not found' });
      } else {
        conversation = await Message.find({
          channel: channel._id,
        })
          .populate('user')
          .sort({ timestamp: -1 });

        if (!conversation) {
          res.status(404).json({ message: 'Cannot find conversation' });
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message });
    }

    res.send(conversation);
  }
);

// Create a message
export const message_create = [
  // Validate fields
  body('text', 'Text field must not be empty').notEmpty(),

  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    // If errors, send error message
    if (!errors.isEmpty()) {
      res.status(400).json;
      ({ errors: errors.array() });
    }

    try {
      const currentUser = await User.findById(req.body.userId).exec();
      if (!currentUser) {
        res.status(404).json({ message: 'User not found' });
      }

      const currentChannel = await Channel.findById(req.params.channelId)
        .populate('participants')
        .exec();

      if (!currentChannel) {
        res.status(404).json({ message: 'Channel not found' });
      }

      const createdMessage = new Message({
        user: currentUser,
        channel: currentChannel,
        text: req.body.text,
      });

      const savedMessage = await createdMessage.save();

      if (currentChannel) {
        currentChannel.latestMessage = savedMessage._id;
        await currentChannel.save();
      }

      res.status(201).json(savedMessage);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message });
    }
  }),
];
