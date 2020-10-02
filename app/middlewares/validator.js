module.exports = (schema, context) => (req, res, next) => {
  const { body, params, query } = req;
  schema
    .validateAsync({ body, params, query }, context)
    .then(() => {
      next();
    })
    .catch(errors => {
      res.statusCode = 400;
      console.log(errors.details);
      return next(errors.details.map(err => ({ msg: err.message })));
    });
};
