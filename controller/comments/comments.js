const Posts = require("../../model/post/post");
const User = require("../../model/user/user");
const Comments = require("../../model/comment/comment");
const appErr = require("../../utils/appError");

const createCommentCtrl = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userID = req.session.userAuth;
    const postFound = await Posts.findById(req.params.id);
    const userFound = await User.findById(req.session.userAuth);

    const comment = await Comments.create({
      user: userID,
      message,
      post: postFound._id,
    });

    await postFound.comments.push(comment._id);
    await userFound.comments.push(comment._id);
    postFound.save();
    userFound.save();

    res.redirect(`/api/v1/posts/${postFound._id}`);
  } catch (error) {
    return next(appErr(error.message));
  }
};

const commentDetailsCtrl = async (req, res, next) => {
  try {
    const commentFound = await Comments.findById(req.params.id);

    res.render("comments/updateComment.ejs", { commentFound, error: "" });
  } catch (error) {
    res.render("comments/updateComment.ejs", {
      commentFound: "",
      error: error.message,
    });
  }
};

const deleteCommentCtrl = async (req, res, next) => {
  try {
    const commentFound = await Comments.findById(req.params.id);

    if (commentFound.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("you are not allowed to delete this comment", 403));
    }

    await Comments.findByIdAndDelete(req.params.id);

    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    return next(appErr(error.message));
  }
};

const updateCommentCtrl = async (req, res, next) => {
  try {
    const { message } = req.body;

    // const commentFound = await Comments.findById(req.params.id);

    // if (!commentFound) {
    //   return next(appErr("Comment not found"));
    // }

    // if (commentFound.user.toString() !== req.session.userAuth.toString()) {
    //   return next(appErr("you are not allowed to update this comment", 403));
    // }

    const commentUpdated = await Comments.findByIdAndUpdate(
      req.params.id,
      {
        message,
      },
      {
        new: true,
      }
    );

    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    return next(appErr(error.message));
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};
