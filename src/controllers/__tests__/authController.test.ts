import * as db from '../../setup/mongoConfigTesting';
import supertest from 'supertest';
import app from '../../app';

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

describe('Auth controller', () => {
  it('should authenticate the user', async () => {
    // Arrange
    const userData = {
      displayName: 'testuser',
      email: 'testemail2@gmail.com',
      password: 'Testpassword123!',
      c_password: 'Testpassword123!',
    };

    await request.post(`/register`).send(userData);

    // Act
    const response = await request.post(`/auth`).send(userData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });
});
