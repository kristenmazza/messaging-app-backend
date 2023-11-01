import { Channel } from '../channel';
import * as db from '../../setup/mongoConfigTesting';
import mongoose from 'mongoose';

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

describe('Channel model', () => {
  it('creates and saves a channel successfully', async () => {
    // Assemble
    const channelData = {
      participants: [
        new mongoose.Types.ObjectId('65307f43ede6531308401a70'),
        new mongoose.Types.ObjectId('65307f43ede6531308401a6f'),
      ],
      latestMessage: new mongoose.Types.ObjectId('65307f43ede6531308401a6d'),
    };

    // Act
    const channel = new Channel(channelData);
    const savedChannel = await channel.save();

    // Assert
    expect(savedChannel._id).toBeDefined();
    expect(savedChannel.participants).toBe(channel.participants);
    expect(savedChannel.latestMessage).toBe(channel.latestMessage);
  });
});
