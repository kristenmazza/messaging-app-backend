import * as db from '../../setup/mongoConfigTesting';
import supertest from 'supertest';
import app from '../../app';
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

describe('User controller', () => {
  it('should get user details', async () => {
    // Arrange
    const userData = {
      displayName: 'testuser',
      email: 'testemail@gmail.com',
      password: 'testpassword123!',
    };

    const user = new User(userData);
    await user.save();

    // Act
    const response = await request.get(`/users/${user._id}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined();
    expect(response.body.displayName).toBe(userData.displayName);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.password).toBe(userData.password);
    expect(response.body.avatar).toBeDefined();
  });
});
