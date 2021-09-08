const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const restController = require("../controllers/restController.js");
const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
const commentController = require("../controllers/commentController.js");
const categoryController = require("../controllers/categoryController.js");
const multer = require("multer");
const upload = multer({ dest: "temp/" });
//helpers is for test only
const helpers = require("../_helpers.js");

//設定只有當test模式下使用不同的登入策略
const authenticated = (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    if (helpers.ensureAuthenticated(req)) {
      return next();
    }
  } else {
    if (req.isAuthenticated()) {
      return next();
    }
  }
  res.redirect("/signin");
};

const authenticatedAdmin = (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next();
      }
      return res.redirect("/");
    }
  }
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next();
    }
    return res.redirect("/");
  }
  res.redirect("/signin");
};

//router info middleware
if (process.env.NODE_ENV !== "production") {
  router.use(function (req, res, next) {
    console.log(`method: ${req.method}, router: ${req.url}`);
    next();
  });
}

//user login/out
router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp);
router.get("/signin", userController.signInPage);
router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  userController.signIn
);
router.get("/logout", userController.logout);

//common user
router.post("/like/:restaurantId", authenticated, userController.addLike);
router.delete("/like/:restaurantId", authenticated, userController.removeLike);
router.post(
  "/favorite/:restaurantId",
  authenticated,
  userController.addFavorite
);
router.delete(
  "/favorite/:restaurantId",
  authenticated,
  userController.removeFavorite
);
router.get("/restaurants", authenticated, restController.getRestaurants);
router.get("/restaurants/feeds", authenticated, restController.getFeeds);
router.get("/restaurants/top", authenticated, restController.getTopRestaurant);
router.get(
  "/restaurants/:id/dashboard",
  authenticated,
  restController.getDashboards
);
router.get("/restaurants/:id", authenticated, restController.getRestaurant);
router.post("/comments", authenticated, commentController.postComment);
router.post("/following/:userId", authenticated, userController.addFollowing);
router.delete(
  "/following/:userId",
  authenticated,
  userController.removeFollowing
);
router.get("/users/top", authenticated, userController.getTopUser);
router.get("/users/:id/edit", authenticated, userController.editUser); //(generate user page with edit btn)
router.get("/users/:id", authenticated, userController.getUser); //(generate edit user page)
router.put(
  "/users/:id",
  authenticated,
  upload.single("image"),
  userController.putUser
); //admin and account owner can edit profile of all users
//admin
router.put(
  "/admin/users/:id/toggleAdmin",
  authenticatedAdmin,
  adminController.toggleAdmin
);
router.get("/admin/users", authenticatedAdmin, adminController.getUsers);
router.delete(
  "/comments/:id",
  authenticatedAdmin,
  commentController.deleteComment
);

router.get(
  "/admin/categories",
  authenticatedAdmin,
  categoryController.getCategories
);
router.get(
  "/admin/categories/:id",
  authenticatedAdmin,
  categoryController.getCategories
);
router.put(
  "/admin/categories/:id",
  authenticatedAdmin,
  categoryController.putCategory
);
router.post(
  "/admin/categories",
  authenticatedAdmin,
  categoryController.postCategory
);
router.delete(
  "/admin/categories/:id",
  authenticatedAdmin,
  categoryController.deleteCategory
);

router.get(
  "/admin/restaurants/create",
  authenticatedAdmin,
  upload.single("image"),
  adminController.createRestaurant
); //go to create.hbs
router.get(
  "/admin/restaurants",
  authenticatedAdmin,
  adminController.getRestaurants
); //view all restaurants in admin mode
router.post(
  "/admin/restaurants",
  authenticatedAdmin,
  upload.single("image"),
  adminController.postRestaurant
); //create a restaurant
router.get(
  "/admin/restaurants/:id/edit",
  authenticatedAdmin,
  upload.single("image"),
  adminController.editRestaurant
); //go to create.hbs (with previous data show)
router.delete(
  "/admin/restaurants/:id",
  authenticatedAdmin,
  adminController.deleteRestaurant
); //delete a restaurant
router.post(
  "/admin/restaurants/edit/:id",
  authenticatedAdmin,
  upload.single("image"),
  adminController.putRestaurant
); //send edit restaurant
router.get("/admin", authenticatedAdmin, (req, res) =>
  res.redirect("/admin/restaurants")
);

//homepage redirection
router.get("/", authenticated, (req, res) => res.redirect("/restaurants"));

module.exports = router;
