import * as db from '../../setup/mongoConfigTesting';
import supertest from 'supertest';
import app from '../../app';
import { Message } from '../../models/message';
import mongoose from 'mongoose';
import { Channel } from '../../models/channel';
import { User } from '../../models/user';

const request = supertest(app);

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

describe('Message controller', () => {
  it('should get message details', async () => {
    // Arrange
    const messageData = {
      user: new mongoose.Types.ObjectId('65307f43ede6531308401a6d'),
      channel: new mongoose.Types.ObjectId('65307f43ede6531308401a6e'),
      timestamp: Date.now(),
      text: 'This is sample text',
    };

    const userMessage = new Message(messageData);
    const savedUserMessage = await userMessage.save();

    // Act
    const response = await request.get(
      `/channels/65307f43ede6531308401a6e/messages/${savedUserMessage._id}`
    );

    // Assert
    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.channel).toBe(messageData.channel.toString());
    expect(response.body.text).toBe(messageData.text);
    expect(response.body.timestamp).toBeDefined();
  });

  it('should get a list of messages', async () => {
    // Arrange
    const user1 = new User({
      _id: '65307f43ede6531308401a6d',
      displayName: 'TestUser',
      email: 'testemail@gmail.com',
      password: 'testpassword123',
    });

    const user2 = new User({
      _id: '65307f43ede6531308401a6e',
      displayName: 'TestUser2',
      email: 'testemail2@gmail.com',
      password: 'testpassword123',
    });

    const channel = new Channel({
      _id: '65307f43ede6531308401a70',
      participants: [
        new mongoose.Types.ObjectId('65307f43ede6531308401a6d'),
        new mongoose.Types.ObjectId('65307f43ede6531308401a6e'),
      ],
    });

    const message1 = new Message({
      user: new mongoose.Types.ObjectId('65307f43ede6531308401a6d'),
      channel: new mongoose.Types.ObjectId('65307f43ede6531308401a70'),
      text: 'Hello',
    });

    const message2 = new Message({
      user: new mongoose.Types.ObjectId('65307f43ede6531308401a6e'),
      channel: new mongoose.Types.ObjectId('65307f43ede6531308401a70'),
      text: 'Hi',
    });

    await Promise.all([
      user1.save(),
      user2.save(),
      channel.save(),
      message1.save(),
      message2.save(),
    ]);

    // Act
    const response = await request.get(
      '/channels/65307f43ede6531308401a70/messages/'
    );

    // Assert
    expect(response.status).toBe(200);
    expect(response.body[0].text).toBe('Hello');
    expect(response.body[1].text).toBe('Hi');
  });

  it('should create a message', async () => {
    // Arrange
    const user1 = new User({
      _id: '65307f43ede6531308401a6d',
      displayName: 'TestUser',
      email: 'testemail@gmail.com',
      password: 'testpassword123',
    });

    const user2 = new User({
      _id: '65307f43ede6531308401a6e',
      displayName: 'TestUser2',
      email: 'testemail2@gmail.com',
      password: 'testpassword123',
    });

    const channelData = {
      _id: '65307f43ede6531308401a70',
      participants: [
        new mongoose.Types.ObjectId('65307f43ede6531308401a6d'),
        new mongoose.Types.ObjectId('65307f43ede6531308401a6e'),
      ],
      latestMessage: new mongoose.Types.ObjectId('65307f43ede6531308401a75'),
    };

    const channel = new Channel(channelData);

    await Promise.all([user1.save(), user2.save(), channel.save()]);

    const messageData = {
      userId: '65307f43ede6531308401a6d',
      text: 'Example message',
    };

    // Act
    const response = await request
      .post('/channels/65307f43ede6531308401a70/messages/')
      .send(messageData);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.channel._id).toBe('65307f43ede6531308401a70');
    expect(response.body.user.displayName).toBe('TestUser');
    expect(response.body.text).toBe('Example message');
  });
});
