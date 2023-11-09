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
    // Act
    const response = await request.get(`/logout`);

    // Assert
    expect(response.status).toBe(204);
  });
});
