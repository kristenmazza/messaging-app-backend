import { User } from '../user';
import * as db from '../../setup/mongoConfigTesting';

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

describe('User model', () => {
  it('creates and saves user successfully', async () => {
    // Arrange
    const userData = {
      displayName: 'testuser',
      email: 'testemail@gmail.com',
      password: 'testpassword123!',
    };

    // Act
    const user = new User(userData);
    const savedUser = await user.save();

    // Assert
    expect(savedUser._id).toBeDefined;
    expect(savedUser.displayName).toBe(userData.displayName);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
  });
});
