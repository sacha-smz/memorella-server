const db = require("./");

class DataMapper {
  static async insertOne(entry) {
    const fields = Object.keys(entry);
    const placeHolders = fields.map((_, i) => "$" + (i + 1));
    const query = {
      text: `INSERT INTO "${this.tableName}" (${fields}) VALUES (${placeHolders}) RETURNING ${this.displayFields}`,
      values: Object.values(entry)
    };

    const result = await db.query(query);
    return result.rows[0];
  }

  static async findOne(filter) {
    const query = {
      text: `SELECT *
             FROM "find_${this.tableName}"($1)
             ORDER BY "id" DESC
             LIMIT 1`,
      values: [filter]
    };

    const result = await db.query(query);
    return result.rows[0];
  }
}

module.exports = DataMapper;
