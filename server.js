const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
require("./config/dbConnect");
const methodOverride = require("method-override");
const usersRouter = require("./routes/users/users");
const postsRouter = require("./routes/posts/posts");
const commentsRouter = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Posts = require("./model/post/post");
const { truncatePost } = require("./utils/helpers");

const app = express();

app.locals.truncatePost = truncatePost;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60,
    }),
  })
);
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }

  next();
});

app.get("/", async (req, res) => {
  try {
    const posts = await Posts.find().populate("user");

    res.render("index.ejs", { posts: posts, error: "" });
  } catch (error) {
    res.render("index.ejs", { posts: posts, error: error.message });
  }
});

// User Routes
app.use("/api/v1/users", usersRouter);

// Post Routes
app.use("/api/v1/posts", postsRouter);

// Comment Routes
app.use("/api/v1/comments", commentsRouter);

app.use(globalErrHandler);

const PORT = process.env.PORT || 8082;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
