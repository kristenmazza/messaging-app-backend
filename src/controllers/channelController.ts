import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Channel } from '../models/channel';
import mongoose from 'mongoose';

// Get channel details
export const channel_detail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let channel;
    let response = { channelExists: false, channel: {} };
    try {
      const user1 = req.query.user1;
      const user2 = req.query.user2;

      if (!user1 || !user2) {
        res.status(400).json({ message: 'Invalid request' });
      }

      channel = await Channel.findOne({
        participants: { $all: [user1, user2] },
      }).populate('participants', 'latestMessage');

      if (channel) {
        response.channelExists = true;
        response.channel = channel;
        res.status(200).json(channel);
      } else {
        res.status(404).json(response);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message });
    }
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
    const currentUserId = req.query.currentUserId as string;
    const id = new mongoose.Types.ObjectId(currentUserId);

    try {
      let channels = await Channel.aggregate([
        {
          $match: {
            participants: id,
          },
        },
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
          },
        },
      ]);

      const populateQuery = [
        { path: 'participants', select: '_id displayName avatar' },
        { path: 'latestMessage' },
      ];

      channels = await Channel.populate(channels, populateQuery);

      if (!channels || channels.length === 0) {
        res.status(404).json({ message: 'Channels not found' });
        return;
      }

      res.send(channels);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message });
    }
  }
);
