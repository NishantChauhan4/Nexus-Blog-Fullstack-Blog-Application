const appErr = require("../utils/appError");

const protected = (req, res, next) => {
  if (req.session.userAuth) {
    next();
  } else {
    res.render("users/notAuthorize.ejs");
  }
};

module.exports = protected;
