import { Schema, model } from 'mongoose';

interface IUser {
  displayName: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default:
      'https://kristen-mazza-blog-images.s3.us-west-1.amazonaws.com/uploads/80b13647-2c86-40ee-a300-80efde421dac-avatar.png',
  },
  refreshToken: String,
});

export const User = model<IUser>('User', userSchema);
