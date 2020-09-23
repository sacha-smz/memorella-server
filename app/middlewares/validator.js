module.exports = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    res.statusCode = 400;
    return next(error.details.map(error => ({ msg: error.message })));
  }

  next();
};
