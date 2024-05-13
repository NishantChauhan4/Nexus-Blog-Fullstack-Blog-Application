const User = require("../../model/user/user");
const bcrypt = require("bcryptjs");
const appErr = require("../../utils/appError");

const registerCtrl = async (req, res, next) => {
  try {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;

    if (!fullname || !email || !password) {
      return res.render("users/register.ejs", {
        error: "All fields are required",
      });
    }

    // Check if user already exist
    const userFound = await User.findOne({
      email,
    });

    if (userFound) {
      return res.render("users/register.ejs", {
        error: "User already exists",
      });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Register user
    const user = await User.create(
      {
        fullname,
        email,
        password: hashedPassword,
      },
      {
        timestamps: true,
      }
    );

    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};

const loginCtrl = async (req, res, next) => {
  // Check if email exist
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.render("users/login.ejs", {
      error: "All fields are required",
    });
  }

  const userFound = await User.findOne({
    email,
  });

  if (!userFound) {
    return res.render("users/login.ejs", {
      error: "Invalid login credentials",
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, userFound.password);
  if (!isPasswordValid) {
    return res.render("users/login.ejs", {
      error: "Invalid login credentials",
    });
  }

  req.session.userAuth = userFound._id;

  res.redirect("/api/v1/users/profile-page");
};

const userDetailsCtrl = async (req, res) => {
  try {
    const userID = req.params.id;

    const user = await User.findById(userID);

    res.render("users/updateUser.ejs", { error: "", user });
  } catch (error) {
    res.render("users/updateUser.ejs", { error: error.message, user });
  }
};

const profileCtrl = async (req, res) => {
  try {
    const userID = req.session.userAuth;

    const user = await User.findById(userID)
      .populate("posts")
      .populate("comments");
    res.render("users/profile.ejs", { user: user });
  } catch (error) {
    res.json(error);
  }
};

const uploadProfilePhotoCtrl = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.render("users/uploadProfilePhoto.ejs", {
        error: "Please upload image",
      });
    }

    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);

    if (userFound) {
      await User.findByIdAndUpdate(userID, {
        profileImage: req.file.path,
      });

      console.log(req.file.path);
    } else {
      return res.render("users/uploadProfilePhoto.ejs", {
        error: "User not found",
      });
    }

    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadProfilePhoto.ejs", { error: error.message });
  }
};

const uploadCoverPhotoCtrl = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.render("users/uploadCoverPhoto.ejs", {
        error: "Please upload image",
      });
    }

    const userID = req.session.userAuth;
    const userFound = await User.findById(userID);

    if (userFound) {
      await User.findByIdAndUpdate(userID, {
        coverImage: req.file.path,
      });

      console.log(req.file.path);
    } else {
      return next(appErr("User not found"));
    }

    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/uploadCoverPhoto.ejs", { error: error.message });
  }
};

const updatePasswordCtrl = async (req, res, next) => {
  try {
    const password = req.body.password;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          password: hashedPassword,
        },
        {
          new: true,
        }
      );
    }

    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/updatePassword.ejs", { error: error.message });
  }
};

const updateUserCtrl = async (req, res, next) => {
  try {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
      return res.render("users/updateUser.ejs", {
        error: "Please provide details",
        user: "",
      });
    }

    const emailTaken = await User.findOne({
      email,
    });

    if (emailTaken) {
      return res.render("users/updateUser.ejs", {
        error: "Email is taken",
        user: "",
      });
    }

    await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );

    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    return res.render("users/updateUser.ejs", {
      error: error.message,
      uesr: "",
    });
  }
};

const logoutCtrl = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverPhotoCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
