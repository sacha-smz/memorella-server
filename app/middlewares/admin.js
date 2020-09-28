const authMiddleware = require("./auth");

module.exports = [
  authMiddleware("access"),
  (req, res, next) => {
    if (!req.user.is_admin) {
      res.statusCode = 403;
      return next({ msg: "Access denied" });
    }
    next();
  }
];
