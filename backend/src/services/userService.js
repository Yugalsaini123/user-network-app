// ==================== backend/src/services/userService.js ====================
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { PopularityService } from './popularityService.js';

export class UserService {
  static async getAllUsers() {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query('SELECT * FROM users ORDER BY createdAt DESC');

      const usersWithDetails = await Promise.all(
        users.map(async (user) => {
          const [friendRows] = await connection.query(`
            SELECT DISTINCT 
              CASE 
                WHEN user_id_1 = ? THEN user_id_2
                ELSE user_id_1
              END as friend_id
            FROM friendships
            WHERE user_id_1 = ? OR user_id_2 = ?
          `, [user.id, user.id, user.id]);

          const friends = friendRows.map(row => row.friend_id);
          const popularityScore = await PopularityService.calculatePopularityScore(user.id);

          return {
            ...user,
            hobbies: user.hobbies,
            friends,
            popularityScore
          };
        })
      );

      return usersWithDetails;
    } finally {
      connection.release();
    }
  }

  static async getUserById(id) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        throw new AppError(404, 'User not found');
      }

      const user = users[0];

      const [friendRows] = await connection.query(`
        SELECT DISTINCT 
          CASE 
            WHEN user_id_1 = ? THEN user_id_2
            ELSE user_id_1
          END as friend_id
        FROM friendships
        WHERE user_id_1 = ? OR user_id_2 = ?
      `, [id, id, id]);

      const friends = friendRows.map(row => row.friend_id);
      const popularityScore = await PopularityService.calculatePopularityScore(id);

      return {
        ...user,
        hobbies: user.hobbies,
        friends,
        popularityScore
      };
    } finally {
      connection.release();
    }
  }

  static async createUser(userData) {
    const connection = await pool.getConnection();
    try {
      const id = uuidv4();
      const hobbiesJson = JSON.stringify(userData.hobbies);

      await connection.query(
        'INSERT INTO users (id, username, age, hobbies) VALUES (?, ?, ?, ?)',
        [id, userData.username, userData.age, hobbiesJson]
      );

      return await this.getUserById(id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError(409, 'Username already exists');
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateUser(id, userData) {
    const connection = await pool.getConnection();
    try {
      await this.getUserById(id);

      const updates = [];
      const values = [];

      if (userData.username) {
        updates.push('username = ?');
        values.push(userData.username);
      }
      if (userData.age !== undefined) {
        updates.push('age = ?');
        values.push(userData.age);
      }
      if (userData.hobbies) {
        updates.push('hobbies = ?');
        values.push(JSON.stringify(userData.hobbies));
      }

      if (updates.length > 0) {
        values.push(id);
        await connection.query(
          `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }

      return await this.getUserById(id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError(409, 'Username already exists');
      }
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteUser(id) {
    const connection = await pool.getConnection();
    try {
      await this.getUserById(id);

      const [friendships] = await connection.query(
        'SELECT COUNT(*) as count FROM friendships WHERE user_id_1 = ? OR user_id_2 = ?',
        [id, id]
      );

      if (friendships[0].count > 0) {
        throw new AppError(409, 'Cannot delete user with active friendships. Please unlink all friends first.');
      }

      await connection.query('DELETE FROM users WHERE id = ?', [id]);
    } finally {
      connection.release();
    }
  }

  static async linkUsers(userId, targetUserId) {
    const connection = await pool.getConnection();
    try {
      await this.getUserById(userId);
      await this.getUserById(targetUserId);

      if (userId === targetUserId) {
        throw new AppError(400, 'Cannot link user to themselves');
      }

      const [user1, user2] = [userId, targetUserId].sort();

      const [existing] = await connection.query(
        'SELECT id FROM friendships WHERE user_id_1 = ? AND user_id_2 = ?',
        [user1, user2]
      );

      if (existing.length > 0) {
        throw new AppError(409, 'Friendship already exists');
      }

      await connection.query(
        'INSERT INTO friendships (user_id_1, user_id_2) VALUES (?, ?)',
        [user1, user2]
      );
    } finally {
      connection.release();
    }
  }

  static async unlinkUsers(userId, targetUserId) {
    const connection = await pool.getConnection();
    try {
      const [user1, user2] = [userId, targetUserId].sort();

      const [result] = await connection.query(
        'DELETE FROM friendships WHERE user_id_1 = ? AND user_id_2 = ?',
        [user1, user2]
      );

      if (result.affectedRows === 0) {
        throw new AppError(404, 'Friendship not found');
      }
    } finally {
      connection.release();
    }
  }

  static async getGraphData() {
    const connection = await pool.getConnection();
    try {
      const users = await this.getAllUsers();

      const [friendships] = await connection.query(
        'SELECT user_id_1, user_id_2 FROM friendships'
      );

      const edges = friendships.map(f => ({
        id: `${f.user_id_1}-${f.user_id_2}`,
        source: f.user_id_1,
        target: f.user_id_2
      }));

      return { users, edges };
    } finally {
      connection.release();
    }
  }

  static async addHobbyToUser(userId, hobby) {
    const connection = await pool.getConnection();
    try {
      const user = await this.getUserById(userId);
      
      if (user.hobbies.includes(hobby)) {
        throw new AppError(400, 'User already has this hobby');
      }

      const updatedHobbies = [...user.hobbies, hobby];
      return await this.updateUser(userId, { hobbies: updatedHobbies });
    } finally {
      connection.release();
    }
  }
}