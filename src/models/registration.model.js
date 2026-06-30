const db = require('../config/db');

class RegistrationModel {
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM registrations WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateStatus(id, status) {
    await db.execute('UPDATE registrations SET status = ? WHERE id = ?', [status, id]);
  }
}

module.exports = RegistrationModel;
