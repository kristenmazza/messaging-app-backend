import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Channel } from '../models/channel';
import mongoose from 'mongoose';

// Get channel details
export const channel_detail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let channel;
    try {
      if (!mongoose.isValidObjectId(req.params.channelId)) {
        res.status(404).json({ message: 'Cannot find channel' });
      }

      channel = await Channel.findById(req.params.channelId)
        .populate('participants')
        .populate('latestMessage');

      if (!channel) {
        res.status(404).json({ message: 'Cannot find channel' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message });
    }

    res.send(channel);
  }
);

// Create a channel
export const channel_create = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const channel = new Channel({
      participants: [req.body.user1, req.body.user2],
    });

    try {
      const savedChannel = await channel.save();
      res.status(201).json(savedChannel);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message });
    }
  }
);

// Get list of channels
export const channel_list = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const channels = await Channel.aggregate([
        {
          $lookup: {
            from: 'message',
            localField: 'latestMessage',
            foreignField: '_id',
            as: 'latestMessageDetails',
          },
        },
        {
          $unwind: {
            path: '$latestMessageDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            'latestMessageDetails.timestamp': 1,
            timestamp: 1,
          },
        },
      ]);

      if (!channels || channels.length === 0) {
        res.status(404).json({ message: 'Channels not found' });
      }

      res.send(channels);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message });
    }
  }
);