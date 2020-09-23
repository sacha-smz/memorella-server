const bcrypt = require("bcrypt");

const authUtils = require("../utils/auth-utils");

const controller = require("./controller");
const userDatamapper = require("../db/user-datamapper");

const sup = controller({ name: "user" });

const authController = {
  login: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await userDatamapper.findOne({ email: { op: "=", val: email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.statusCode = 401;
        return next({ msg: "Login failed, the username or password is incorrect" });
      }

      const accessToken = authUtils.signAccessToken(user);
      const refreshToken = await authUtils.signRefreshToken(user);

      return res.json({ data: { ...sup.getDisplay(user), accessToken, refreshToken } });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      await authUtils.revokeUserRefreshToken(req.user);
      await authUtils.blacklistAccessToken(req.user);
      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  },

  refresh: (req, res, next) => {
    try {
      const accessToken = authUtils.signAccessToken(req.user);
      res.json({ data: accessToken });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
