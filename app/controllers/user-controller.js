const bcrypt = require("bcrypt");

const controller = require("./controller");
const userDatamapper = require("../db/user-datamapper");

const userController = {
  signup: async (req, res, next) => {
    delete req.body.confirm;
    req.body.password = await bcrypt.hash(req.body.password, 10);
    controller({ datamapper: userDatamapper }).createOne(req, res, next);
  }
};

module.exports = userController;
