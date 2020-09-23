const DataMapper = require("./datamapper");

class UserDatamapper extends DataMapper {
  static tableName = "user";
  static displayFields = [
    "id",
    "email",
    "firstname",
    "lastname",
    "avatar_url",
    "created_at",
    "updated_at"
  ];
}

module.exports = UserDatamapper;
