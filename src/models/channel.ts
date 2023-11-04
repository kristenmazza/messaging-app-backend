import { Schema, Types, model } from 'mongoose';

interface IChannel {
  participants: Types.ObjectId[];
  latestMessage: Types.ObjectId;
  timestamp: Date;
}

const channelSchema = new Schema<IChannel>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  timestamp: { type: Date, default: Date.now },
});

export const Channel = model<IChannel>('Channel', channelSchema);
