const DataMapper = require("./datamapper");

class DeckDatamapper extends DataMapper {
  static tableName = "deck";
  static displayFields = ["id", "name", "created_at", "updated_at", "cards"];
  static hasInsertFn = true;
  static hasDisplayFn = true;
  static hasUpdateOneFn = true;
}

module.exports = DeckDatamapper;
