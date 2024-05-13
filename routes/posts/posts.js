const express = require("express");
const {
  createPostsCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
} = require("../../controller/posts/posts");
const protected = require("../../middlewares/protected");
const multer = require("multer");
const storage = require("../../config/cloudinary");
const Posts = require("../../model/post/post");

const upload = multer({ storage });

const postsRouter = express.Router();

postsRouter.get("/get-post-form", (req, res) => {
  res.render("posts/addPost.ejs", { error: "" });
});

postsRouter.post("/", protected, upload.single("post-image"), createPostsCtrl);

postsRouter.get("/", fetchPostsCtrl);

postsRouter.get("/:id", fetchPostCtrl);

postsRouter.get("/get-form-update/:id", async (req, res) => {
  try {
    const postFound = await Posts.findById(req.params.id);

    res.render("posts/updatePost.ejs", { postFound, error: "" });
  } catch (error) {
    res.render("posts/updatePost.ejs", { postFound: "", error });
  }
});

postsRouter.delete("/:id", protected, deletePostCtrl);

postsRouter.put("/:id", protected, upload.single("post-image"), updatePostCtrl);

module.exports = postsRouter;
