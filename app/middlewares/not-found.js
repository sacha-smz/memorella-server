module.exports = (_, res, next) => {
  res.statusCode = 404;
  next({ msg: "Ressource not found" });
};
