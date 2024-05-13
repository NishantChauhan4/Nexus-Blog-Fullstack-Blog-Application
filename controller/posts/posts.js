const Posts = require("../../model/post/post");
const User = require("../../model/user/user");
const appErr = require("../../utils/appError");

const createPostsCtrl = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category || !req.file) {
      return res.render("posts/addPost.ejs", {
        error: "All fields are required",
      });
    }

    const userID = req.session.userAuth;

    const userFound = await User.findById(userID);

    const postCreated = await Posts.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });

    userFound.posts.push(postCreated._id);
    await userFound.save();

    res.redirect("/");
  } catch (error) {
    return res.render("posts/addPost.ejs", {
      error: error.message,
    });
  }
};

const fetchPostsCtrl = async (req, res, next) => {
  try {
    const postsFound = await Posts.find().populate("comments").populate("user");

    res.json({
      status: "Success",
      data: postsFound,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

const fetchPostCtrl = async (req, res, next) => {
  try {
    const id = req.params.id;

    const postFound = await Posts.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate("user");

    res.render("posts/postDetails.ejs", {
      postFound,
      error: "",
      commentError: "",
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

const deletePostCtrl = async (req, res, next) => {
  try {
    const postFound = await Posts.findById(req.params.id);

    if (postFound.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/postDetails.ejs", {
        error: "You are not authorized to delete this post",
        postFound,
      });
    }

    await Posts.findByIdAndDelete(req.params.id);

    res.redirect("/");
  } catch (error) {
    return res.render("posts/postDetails.ejs", {
      error: error.message,
      postFound: "",
    });
  }
};

const updatePostCtrl = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    const postFound = await Posts.findById(req.params.id);

    if (postFound.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/updatePost.ejs", {
        postFound: "",
        error: "You are not authorized to update this post",
      });
    }

    if (req.file) {
      await Posts.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
          image: req.file.path,
        },
        {
          new: true,
        }
      );
    } else {
      await Posts.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          category,
        },
        {
          new: true,
        }
      );
    }

    res.redirect("/");
  } catch (error) {
    return res.render("posts/updatePost.ejs", {
      postFound: "",
      error: error.message,
    });
  }
};

module.exports = {
  createPostsCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
