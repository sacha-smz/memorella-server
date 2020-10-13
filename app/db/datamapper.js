const db = require("./");

class DataMapper {
  static async insertOne(entry) {
    const query = {};

    if (this.hasInsertFn) {
      query.text = `SELECT ${this.displayFields} FROM "insert_${this.tableName}"($1)`;
      query.values = [entry];
    } else {
      const fields = Object.keys(entry);
      const placeHolders = getPlaceHolders(fields);
      query.text = `INSERT INTO "${this.tableName}" (${fields}) VALUES (${placeHolders}) RETURNING ${this.displayFields}`;
      query.values = Object.values(entry);
    }

    const result = await db.query(query);
    return result.rows[0];
  }

  static getPkFilter(id) {
    return {
      id: {
        table: this.tableName,
        op: "=",
        val: id
      }
    };
  }

  static get findQuery() {
    return `SELECT *
            FROM "find_${this.tableName}"($1)
            ORDER BY "id" DESC`;
  }

  static async find(filter) {
    const query = { text: this.findQuery, values: [filter] };
    const result = await db.query(query);
    return result.rows;
  }

  static async findOne(filter) {
    const query = { text: this.findQuery + " LIMIT 1", values: [filter] };
    const result = await db.query(query);
    return result.rows[0];
  }

  static get showQuery() {
    let fields, fn;
    if (this.hasDisplayFn) {
      fields = "*";
      fn = "display";
    } else {
      fields = this.displayFields;
      fn = "find";
    }

    return `SELECT ${fields}
            FROM "${fn}_${this.tableName}"($1)
            ORDER BY "id" DESC`;
  }

  static async show(filter) {
    const query = { text: this.showQuery, values: [filter] };
    const result = await db.query(query);
    return result.rows;
  }

  static async showOne(filter) {
    const query = { text: this.showQuery + " LIMIT 1", values: [filter] };
    const result = await db.query(query);
    return result.rows[0];
  }

  static showByPk(id) {
    return this.showOne(this.getPkFilter(id));
  }

  static getUpdateQuery(update, filter) {
    if (this.hasUpdateFn) {
      return {
        text: `SELECT *
               FROM "update_${this.tableName}"($1, $2)
               ORDER BY "id" DESC`,
        values: [update, filter]
      };
    }

    const fields = Object.keys(update);
    const [whereClause, filterValues] = parseFilter(filter, fields.length);
    const text = `UPDATE "${this.tableName}"
                  SET (${fields}) = (${getPlaceHolders(fields)})${whereClause}
                  RETURNING ${this.displayFields}`;
    return { text, values: [...Object.values(update), ...filterValues] };
  }

  static async update(update, filter) {
    const query = this.getUpdateQuery();
    const result = await db.query(query);
    return result.rows;
  }

  static getUpdateOneQuery(update, filter) {
    if (this.hasUpdateOneFn) {
      return {
        text: `SELECT *
               FROM "update_one_${this.tableName}"($1, $2)
               ORDER BY "id" DESC
               LIMIT 1`,
        values: [update, filter]
      };
    }

    const fields = Object.keys(update);
    const [whereClause, filterValues] = parseFilter(filter, fields.length);
    const text = `UPDATE "${this.tableName}"
                  SET (${fields}) = (${getPlaceHolders(fields)})
                  WHERE "id" = (SELECT "id" FROM "${this.tableName}"${whereClause}
                                ORDER BY "id" DESC
                                LIMIT 1)
                  RETURNING ${this.displayFields}`;
    return { text, values: [...Object.values(update), ...filterValues] };
  }

  static async updateOne(update, filter) {
    const query = this.getUpdateOneQuery(update, filter);
    const result = await db.query(query);
    return result.rows[0];
  }

  static updateByPk(id, update) {
    return this.updateOne(update, this.getPkFilter(id));
  }
}

module.exports = DataMapper;

function parseFilter(filter, valIndex = 0) {
  let clause = "";
  const values = [];

  Object.entries(filter).forEach(([field, { table, op, val }], i) => {
    clause += i === 0 ? " WHERE " : " AND ";

    if (table) {
      clause += `"${table}".`;
    }
    clause += `"${field}" ${op}`;
    if (typeof val !== "undefined") {
      clause += " $" + ++valIndex;
      values.push(val);
    }
  });

  return [clause, values];
}

function getPlaceHolders(fields) {
  return fields.map((_, i) => "$" + (i + 1));
}
