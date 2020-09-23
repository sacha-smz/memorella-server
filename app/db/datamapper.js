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
}

module.exports = DataMapper;
