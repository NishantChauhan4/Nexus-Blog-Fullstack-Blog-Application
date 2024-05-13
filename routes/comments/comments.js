const express = require("express");
const {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../../controller/comments/comments");
const protected = require("../../middlewares/protected");

const commentsRouter = express.Router();

commentsRouter.post("/:id", protected, createCommentCtrl);

commentsRouter.get("/:id", commentDetailsCtrl);

commentsRouter.delete("/:id", protected, deleteCommentCtrl);

commentsRouter.put("/:id", protected, updateCommentCtrl);

module.exports = commentsRouter;
