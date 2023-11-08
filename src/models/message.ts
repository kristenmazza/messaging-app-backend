import { Schema, Types, model } from 'mongoose';

interface IMessage {
  user: Types.ObjectId;
  channel: Types.ObjectId;
  timestamp: Date;
  text: string;
}

const messageSchema = new Schema<IMessage>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
  timestamp: { type: Date, default: Date.now },
  text: { type: String, required: true },
});

export const Message = model<IMessage>('Message', messageSchema);
