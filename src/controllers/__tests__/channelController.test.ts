import * as db from '../../setup/mongoConfigTesting';
import supertest from 'supertest';
import app from '../../app';
import { Channel } from '../../models/channel';
import mongoose from 'mongoose';
import { User } from '../../models/user';
import { Message } from '../../models/message';

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

describe('Channel controller', () => {
  it('should get channel details', async () => {
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

    const [savedMessage, savedChannel] = await Promise.all([
      user1.save(),
      user2.save(),
      channel.save(),
    ]);

    // Act
    const response = await request.get(`/channels/65307f43ede6531308401a70`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(channelData._id);
    expect(response.body.participants[0]._id.toString()).toBe(
      user1._id.toString()
    );
    expect(response.body.participants[1]._id.toString()).toBe(
      user2._id.toString()
    );
  });

  it('should create a channel', async () => {
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

    const participants = {
      user1: new mongoose.Types.ObjectId(user1._id),
      user2: new mongoose.Types.ObjectId(user2._id),
    };

    await Promise.all([user1.save(), user2.save()]);

    // Act
    const response = await request.post(`/channels/`).send(participants);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.participants.toString()).toBe(
      [participants.user1._id, participants.user2._id].toString()
    );
  });

  it('should get list of channels', async () => {
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

    const user3 = new User({
      _id: '65453d348711a97b7333b4ba',
      displayName: 'TestUser3',
      email: 'testemail3@gmail.com',
      password: 'testpassword123',
    });

    const now = new Date();
    const later = new Date(now.getTime() + 1000);

    const channel1 = new Channel({
      _id: '65307f43ede6531308401a70',
      participants: [user2._id, user1._id],
      timestamp: now,
    });

    const channel2 = new Channel({
      _id: '654538d2b6a718b8aa3e1daa',
      participants: [user3._id, user1._id],
      timestamp: now,
    });

    const message1 = new Message({
      user: user1._id,
      channel: channel1._id,
      text: 'Message 1',
      timestamp: new Date(now.getTime() + 100),
    });

    const message2 = new Message({
      user: user3._id,
      channel: channel2._id,
      text: 'Message 2',
      timestamp: new Date(later.getTime() + 100),
    });

    await Promise.all([
      user1.save(),
      user2.save(),
      user3.save(),
      channel1.save(),
      channel2.save(),
      message1.save(),
      message2.save(),
    ]);

    // Act
    const response = await request.get(`/channels`);

    // Assert
    expect(response.status).toBe(200);
    // Ensures there are two channels
    expect(response.body[0]._id).toBeDefined();
    expect(response.body[1]._id).toBeDefined();
  });
});
