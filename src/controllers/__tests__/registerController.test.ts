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

describe('Register controller', () => {
  it('should register a new user', async () => {
    // Arrange
    const userData = {
      displayName: 'testuser',
      email: 'testemail2@gmail.com',
      password: 'Testpassword123!',
      c_password: 'Testpassword123!',
    };

    // Act
    const response = await request.post(`/register`).send(userData);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.success).toBeDefined();
    expect(response.body.success).toStrictEqual(
      'New user testemail2@gmail.com created'
    );
  });

  it('should display error message for empty display name', async () => {
    // Arrange
    const userData = {
      displayName: '',
      email: 'testemail2@gmail.com',
      password: 'Testpassword123!',
      c_password: 'Testpassword123!',
    };

    // Act
    const response = await request.post(`/register`).send(userData);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toStrictEqual(
      'Display name cannot be blank'
    );
  });

  it('should display error message for invalid email', async () => {
    // Arrange
    const userData = {
      displayName: 'testuser',
      email: 'testemail',
      password: 'Testpassword123!',
      c_password: 'Testpassword123!',
    };

    // Act
    const response = await request.post(`/register`).send(userData);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toStrictEqual('Email is not valid');
  });

  it('should display error message for invalid password', async () => {
    // Arrange
    const userData = {
      displayName: 'testuser',
      email: 'testemail@gmail.com',
      password: 'Testpassword',
      c_password: 'Testpassword',
    };

    // Act
    const response = await request.post(`/register`).send(userData);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toStrictEqual(
      'Password must contain 6 characters with at least 1 lowercase letter, 1 uppercase letter, and 1 symbol'
    );
  });

  it('should display error message for password mismatch', async () => {
    // Arrange
    const userData = {
      displayName: 'testuser',
      email: 'testemail@gmail.com',
      password: 'Testpassword@123',
      c_password: 'Testpassword',
    };

    // Act
    const response = await request.post(`/register`).send(userData);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toStrictEqual('Passwords do not match');
  });
});
