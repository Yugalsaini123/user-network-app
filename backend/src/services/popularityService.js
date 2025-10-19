// ==================== backend/src/services/popularityService.js ====================
import pool from '../config/database.js';

export class PopularityService {
  static async calculatePopularityScore(userId) {
    const connection = await pool.getConnection();
    try {
      const [friendRows] = await connection.query(`
        SELECT DISTINCT 
          CASE 
            WHEN user_id_1 = ? THEN user_id_2
            ELSE user_id_1
          END as friend_id
        FROM friendships
        WHERE user_id_1 = ? OR user_id_2 = ?
      `, [userId, userId, userId]);

      const uniqueFriends = friendRows.length;

      const [userRows] = await connection.query(
        'SELECT hobbies FROM users WHERE id = ?',
        [userId]
      );

      if (userRows.length === 0) return 0;

      const userHobbies = userRows[0].hobbies;
      let totalSharedHobbies = 0;

      for (const friend of friendRows) {
        const [friendData] = await connection.query(
          'SELECT hobbies FROM users WHERE id = ?',
          [friend.friend_id]
        );

        if (friendData.length > 0) {
          const friendHobbies = friendData[0].hobbies;
          const sharedHobbies = userHobbies.filter(h => 
            friendHobbies.includes(h)
          );
          totalSharedHobbies += sharedHobbies.length;
        }
      }

      const popularityScore = uniqueFriends + (totalSharedHobbies * 0.5);
      return Math.round(popularityScore * 10) / 10;
    } finally {
      connection.release();
    }
  }
}