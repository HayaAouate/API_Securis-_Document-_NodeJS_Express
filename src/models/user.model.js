const db = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(userData) {
    // Récupération du max id
    const [maxResult] = await db.execute('SELECT MAX(id) as maxId FROM users');
    const newId = (maxResult[0].maxId || 0) + 1;

    const { email, password_hash, first_name, last_name, role, bio } = userData;
    
    await db.execute(
      'INSERT INTO users (id, email, password_hash, first_name, last_name, role, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newId, email, password_hash, first_name, last_name, role, bio || null]
    );

    return newId;
  }
}

module.exports = UserModel;
