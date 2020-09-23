const jwt = require("express-jwt");

const authUtils = require("../utils/auth-utils");

module.exports = (type = "access") => [
  jwt({
    secret: process.env[type.toUpperCase() + "_TOKEN_SECRET"],
    algorithms: ["HS256"],
    isRevoked: async (req, payload, done) => {
      try {
        let isRevoked = false;
        if (type === "access") {
          isRevoked = await authUtils.isRevokedToken(payload);
        } else if (type === "refresh") {
          const authHeader = req.headers["authorization"];
          const token = authHeader && authHeader.split(" ")[1];
          isRevoked = !(await authUtils.isValidRefreshToken(payload, token));
        }
        done(null, isRevoked);
      } catch (err) {
        done(err);
      }
    }
  }),
  (err, _, res, next) => {
    if (err.name === "UnauthorizedError") {
      err.msg = "Unauthorized";
      res.statusCode = 401;
    }
    next(err);
  }
];
