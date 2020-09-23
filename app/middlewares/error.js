const errorMap = new Map([
  ["23505", { msg: "SQL - Unique constraint violation", code: 409 }],
  ["23503", { msg: "SQL - Foreign key constraint violation", code: 409 }],
  ["42601", { msg: "SQL - Syntax error" }],
  ["ENOENT", { msg: "File access error, the path does not exist" }],
  ["ENOTDIR", { msg: "File access error, the path does not correspond to a directory" }],
  ["credentials_required", { msg: "The access token is missing", code: 401 }],
  ["invalid_token", { msg: "The access token is invalid", code: 403 }],
  ["revoked_token", { msg: "The access token is no longer valid", code: 403 }]
]);

module.exports = (errors, _, res, __) => {
  if (!Array.isArray(errors)) {
    errors = [errors];
  }

  errors.forEach(err => {
    if (errorMap.has(err.code)) {
      const error = errorMap.get(err.code);
      res.statusCode = error.code;
      err.msg = error.msg + " - " + err.toString();
    } else if (!("msg" in err)) {
      err.msg = err.toString();
    }
  });

  if (!res.statusCode || res.statusCode < 400) {
    res.status(500);
  }

  res.json({ errors });

  console.error({ errors, status: res.statusCode });
};
