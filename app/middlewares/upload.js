const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const multer = require("multer");

const limits = {
  fileSize: 1000 * 1000
};

const fileFilter = (req, file, cb) => {
  if (/\/admin\/decks/.test(req.baseUrl + req.path) && /^image\/(jpeg|png)$/.test(file.mimetype))
    return cb(null, true);
  return cb(new Error("Invalid file format"));
};

module.exports = field => (req, res, next) => {
  const upload = multer({
    dest: path.resolve("temp/" + field),
    limits,
    fileFilter
  }).array(field + "[]", 64);

  upload(req, res, async uploadErr => {
    if (uploadErr) {
      const errors = [uploadErr];
      if (req.files) {
        for (const file of req.files) {
          try {
            if (fs.existsSync(file.path)) {
              await fsPromises.unlink(file.path);
            }
          } catch (err) {
            errors.push(err);
          }
        }
      }

      return next(errors);
    }

    next();
  });
};
