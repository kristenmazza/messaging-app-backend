import { Message } from '../message';
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

describe('Message model', () => {
  it('creates and saves message successfully', async () => {
    // Assemble
    const messageData = {
      user: new mongoose.Types.ObjectId('65307f43ede6531308401a6d'),
      channel: new mongoose.Types.ObjectId('65307f43ede6531308401a6e'),
      timestamp: Date.now(),
      text: 'Test message text',
    };

    // Act
    const message = new Message(messageData);
    const savedMessage = await message.save();

    // Assert
    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.user).toBe(message.user);
    expect(savedMessage.channel).toBe(message.channel);
    expect(savedMessage.timestamp).toBe(message.timestamp);
    expect(savedMessage.text).toBe(message.text);
  });
});
