const { formidable, errors } = require("formidable");

module.exports = (req, res, next) => {
  const form = formidable({
    keepExtensions: true,
    allowEmptyFiles: true,
    uploadDir: `${__dirname}/../images`,
    minFileSize: 0,
    filename: (name, exr, part, form) => {
      if (name == "invalid-name" || exr == null) {
        return "";
      } else {
        return name + exr;
      }
    },
    filter: ({ name, originalFilename, mimetype }) => {
      let asExpected = false;
      const valid =
        (mimetype && mimetype.includes("image")) || originalFilename == "";
      if (!valid) {
        form.emit("error", new errors.default("File should be image", 0, 400));
        asExpected = true;
      }
      return valid && !asExpected;
    },
  });
  form.parse(req, (err, fields, file) => {
    if (err) {
      next(err);
      return;
    }
    req.file = file.image.map((item) => item.newFilename);
    console.log("FIELDS", fields);
    req.body = {
      title: fields.title[0],
      price: fields.price[0],
      imageUrl: fields.imageUrl ? fields.imageUrl : [],
      description: fields.description[0],
      _id: fields._id && fields._id[0],
      _csrf: fields._csrf && fields._csrf[0],
    };
    next();
  });
};
