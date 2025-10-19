import request from 'supertest';
import { createApp } from '../src/app.js';
import pool from '../src/config/database.js';
const app = createApp();
let testUserId1, testUserId2;

describe('Cybernauts Assignment - API Tests', () => {
  
  // Test 1: Create User
  it('should create a new user with valid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        username: `testuser_${Date.now()}`,
        age: 25,
        hobbies: ['reading', 'gaming']
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toContain('testuser_');
    expect(response.body.age).toBe(25);
    expect(response.body.hobbies).toEqual(['reading', 'gaming']);
    expect(response.body.popularityScore).toBe(0); // No friends yet
    testUserId1 = response.body.id;
  });

  // Test 2: Create Second User for Friendship Tests
  it('should create a second user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        username: `testuser2_${Date.now()}`,
        age: 28,
        hobbies: ['reading', 'cooking'] // Shares 'reading' with user1
      });

    expect(response.status).toBe(201);
    testUserId2 = response.body.id;
  });

  // Test 3: Link Users (Create Friendship)
  it('should link two users successfully', async () => {
    const response = await request(app)
      .post(`/api/users/${testUserId1}/link`)
      .send({ targetUserId: testUserId2 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Users linked successfully');
  });

  // Test 4: Popularity Score Calculation
  it('should calculate popularity score correctly', async () => {
    const response = await request(app)
      .get(`/api/users/${testUserId1}`);

    expect(response.status).toBe(200);
    // Formula: uniqueFriends + (sharedHobbies × 0.5)
    // User1 has 1 friend and shares 1 hobby (reading) = 1 + (1 × 0.5) = 1.5
    expect(response.body.popularityScore).toBe(1.5);
  });

  // Test 5: Prevent Circular/Duplicate Friendship
  it('should prevent duplicate friendship (circular prevention)', async () => {
    const response = await request(app)
      .post(`/api/users/${testUserId2}/link`)
      .send({ targetUserId: testUserId1 });

    expect(response.status).toBe(409);
    expect(response.body.message).toContain('already exists');
  });

  // Test 6: Cannot Delete User With Active Friendships
  it('should prevent deletion of user with active friendships', async () => {
    const response = await request(app)
      .delete(`/api/users/${testUserId1}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toContain('active friendships');
  });

  // Test 7: Unlink Users
  it('should unlink users successfully', async () => {
    const response = await request(app)
      .delete(`/api/users/${testUserId1}/unlink`)
      .send({ targetUserId: testUserId2 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Users unlinked successfully');
  });

  // Test 8: Can Delete After Unlinking
  it('should allow deletion after unlinking all friendships', async () => {
    const response = await request(app)
      .delete(`/api/users/${testUserId1}`);

    expect(response.status).toBe(204);
  });

  // Test 9: Validation - Missing Required Fields
  it('should return 400 for missing required fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        username: 'incomplete'
        // Missing age and hobbies
      });

    expect(response.status).toBe(400);
  });

  // Test 10: Get Graph Data
  it('should return graph data with users and edges', async () => {
    const response = await request(app)
      .get('/api/graph');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('edges');
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(Array.isArray(response.body.edges)).toBe(true);
  });
  afterAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM friendships');
    await pool.query('DELETE FROM users WHERE username LIKE "testuser%"');
    
    // Close pool connections
    await pool.end();
  });
});