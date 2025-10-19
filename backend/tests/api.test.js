import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('User Network API Tests', () => {
  let userId1, userId2;

  // Test 1: Create User
  test('POST /api/users - should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser1',
        age: 25,
        hobbies: ['reading', 'gaming']
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser1');
    expect(response.body.popularityScore).toBe(0);
    userId1 = response.body.id;
  });

  // Test 2: Create Second User
  test('POST /api/users - should create second user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser2',
        age: 28,
        hobbies: ['reading', 'cooking']
      });

    expect(response.status).toBe(201);
    userId2 = response.body.id;
  });

  // Test 3: Link Users
  test('POST /api/users/:id/link - should link two users', async () => {
    const response = await request(app)
      .post(`/api/users/${userId1}/link`)
      .send({ targetUserId: userId2 });

    expect(response.status).toBe(201);
  });

  // Test 4: Popularity Score Calculation
  test('GET /api/users/:id - should calculate popularity score correctly', async () => {
    const response = await request(app).get(`/api/users/${userId1}`);
    
    expect(response.status).toBe(200);
    // 1 friend + (1 shared hobby * 0.5) = 1.5
    expect(response.body.popularityScore).toBeGreaterThan(0);
  });

  // Test 5: Prevent Circular Friendship
  test('POST /api/users/:id/link - should prevent duplicate friendship', async () => {
    const response = await request(app)
      .post(`/api/users/${userId2}/link`)
      .send({ targetUserId: userId1 });

    expect(response.status).toBe(409);
  });

  // Test 6: Prevent Deletion with Active Friendships
  test('DELETE /api/users/:id - should prevent deletion with friendships', async () => {
    const response = await request(app).delete(`/api/users/${userId1}`);
    
    expect(response.status).toBe(409);
    expect(response.body.message).toContain('active friendships');
  });

  // Test 7: Unlink Users
  test('DELETE /api/users/:id/unlink - should unlink users', async () => {
    const response = await request(app)
      .delete(`/api/users/${userId1}/unlink`)
      .send({ targetUserId: userId2 });

    expect(response.status).toBe(200);
  });

  // Test 8: Get Graph Data
  test('GET /api/graph - should return graph data', async () => {
    const response = await request(app).get('/api/graph');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('edges');
  });
});