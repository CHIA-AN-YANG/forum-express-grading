const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const multer = require("multer");
const upload = multer({ dest: "temp/" });
const adminController = require("../controllers/api/adminController.js");
const categoryController = require("../controllers/api/categoryController.js");
const userController = require("../controllers/api/userController.js");

const authenticated = passport.authenticate("jwt", { session: false });

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) {
      return next();
    }
    return res.json({
      status: "error",
      message: "permission denied, not an admin.",
    });
  } else {
    return res.json({
      status: "error",
      message: "permission denied, user not valid.",
    });
  }
};

router.get(
  "/admin/restaurants",
  authenticated,
  authenticatedAdmin,
  adminController.getRestaurants
);
router.get(
  "/admin/restaurants/:id",
  authenticated,
  authenticatedAdmin,
  adminController.getRestaurant
);
router.get(
  "/admin/categories",
  authenticated,
  authenticatedAdmin,
  categoryController.getCategories
);
router.post(
  "/admin/categories",
  authenticated,
  authenticatedAdmin,
  categoryController.postCategory
);
router.put(
  "/admin/categories/:id",
  authenticated,
  authenticatedAdmin,
  categoryController.putCategory
);
router.delete(
  "/admin/categories/:id",
  authenticated,
  authenticatedAdmin,
  categoryController.deleteCategory
);
router.post(
  "/admin/restaurants",
  upload.single("image"),
  authenticated,
  authenticatedAdmin,
  adminController.postRestaurant
);

router.post("/signin", userController.signIn);
router.post("/signup", userController.signUp);

module.exports = router;
