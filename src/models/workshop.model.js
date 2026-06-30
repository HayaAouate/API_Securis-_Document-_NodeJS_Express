const db = require('../config/db');

class WorkshopModel {
  static async findAll({ category, limit, offset }) {
    let query = `
      SELECT w.id, w.title, w.slug, w.description, w.starts_at, w.duration_minutes, w.price_cents,
             c.name as category_name, u.first_name as trainer_first_name, u.last_name as trainer_last_name
      FROM workshops w
      JOIN categories c ON w.category_id = c.id
      JOIN users u ON w.trainer_id = u.id
    `;
    const params = [];

    if (category) {
      query += ` WHERE c.slug = ?`;
      params.push(category);
    }
    
    query += ` ORDER BY w.starts_at ASC LIMIT ? OFFSET ?`;
    params.push(Number(limit) || 10, Number(offset) || 0);

    // On utilise db.query au lieu de db.execute car MySQL gère mal les 
    // variables préparées (execute) pour LIMIT et OFFSET
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM workshops WHERE id = ?', [id]);
    return rows[0];
  }

  static async getParticipants(workshopId) {
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.email, r.status, r.registered_at
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.workshop_id = ?
    `;
    const [rows] = await db.execute(query, [workshopId]);
    return rows;
  }
}

module.exports = WorkshopModel;
