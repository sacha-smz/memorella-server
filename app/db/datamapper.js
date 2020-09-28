const db = require("./");

class DataMapper {
  static async insertOne(entry) {
    const query = {};

    if (this.hasInsertFn) {
      query.text = `SELECT ${this.displayFields} FROM insert_${this.tableName}($1)`;
      query.values = [entry];
    } else {
      const fields = Object.keys(entry);
      const placeHolders = fields.map((_, i) => "$" + (i + 1));
      query.text = `INSERT INTO "${this.tableName}" (${fields}) VALUES (${placeHolders}) RETURNING ${this.displayFields}`;
      query.values = Object.values(entry);
    }

    const result = await db.query(query);
    return result.rows[0];
  }

  static async find(filter) {
    const query = {
      text: `SELECT *
             FROM "find_${this.tableName}"($1)
             ORDER BY "id" DESC`,
      values: [filter]
    };

    const result = await db.query(query);
    return result.rows;
  }

  static async show(filter) {
    let fields, fn;
    if (this.hasDisplayFn) {
      fields = "*";
      fn = "display";
    } else {
      fields = this.displayFields;
      fn = "find";
    }

    const query = {
      text: `SELECT ${fields}
             FROM ${fn}_${this.tableName}($1)
             ORDER BY "id" DESC`,
      values: [filter]
    };

    const result = await db.query(query);
    return result.rows;
  }

  static async showByPk(id) {
    return (
      await this.show({
        id: {
          table: this.tableName,
          op: "=",
          val: id
        }
      })
    )[0];
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
