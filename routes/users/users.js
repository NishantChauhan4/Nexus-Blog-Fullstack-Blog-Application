const express = require("express");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverPhotoCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controller/users/users");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const multer = require("multer");

const upload = multer({ storage });

const usersRouter = express.Router();

usersRouter.get("/login", (req, res) => {
  res.render("users/login.ejs", { error: "" });
});

usersRouter.get("/register", (req, res) => {
  res.render("users/register.ejs", { error: "" });
});

usersRouter.get("/profile-page", protected, profileCtrl);

usersRouter.get("/update-user-password", (req, res) => {
  res.render("users/updatePassword.ejs", { error: "" });
});

usersRouter.get("/upload-profile-photo-form", (req, res) => {
  res.render("users/uploadProfilePhoto.ejs", { error: "" });
});

usersRouter.get("/upload-cover-photo-form", (req, res) => {
  res.render("users/uploadCoverPhoto.ejs", { error: "" });
});

usersRouter.post("/register", registerCtrl);

usersRouter.post("/login", loginCtrl);

usersRouter.put(
  "/profile-photo-upload",
  protected,
  upload.single("profile-photo"),
  uploadProfilePhotoCtrl
);

usersRouter.put(
  "/cover-photo-upload",
  protected,
  upload.single("cover-photo"),
  uploadCoverPhotoCtrl
);

usersRouter.put("/update-password", updatePasswordCtrl);

usersRouter.put("/update", updateUserCtrl);

usersRouter.get("/logout", logoutCtrl);

usersRouter.get("/:id", userDetailsCtrl);

module.exports = usersRouter;
