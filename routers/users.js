const express = require("express");
const router = express.Router();
const { check, param, body, query } = require("express-validator");
const isAuth = require("../middleware/isAuth");
const user = require("../controllers/users");
const User = require("../models/users");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

router.get(
  "/users",
  isAuth,
  [
    query(
      "perPage",
      "Please select at least the amount of register you wanna show"
    ).isNumeric({ min: 1 }),
    query("page", "Please select at least a page ").isNumeric({
      min: 1,
    }),
  ],
  user.getAllUsers
);

router.get(
  "/users/:userId",
  isAuth,
  [
    param("userId", "Please select at least a user")
      .trim()
      .isLength({ min: 1 }),
  ],
  user.getUserById
);

router.post(
  "/users",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value, { req }) => {
        try {
          const userFound = await User.findOne({ email: value });
          if (userFound) {
            const error = new Error(
              "Favor eliga otro correo ya que existe un usuario con este correo"
            );
            error.statusCode = 400;
            error.codigo = "g268";
            throw error;
          }
          return true;
        } catch (err) {
          err.statusCode = 500;
          throw err;
        }
      }),
    body("password", "Please enter a password").trim().isLength({ min: 5 }),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          const error = new Error("Las contraseñas deben ser iguales");
          error.codigo = "g268";
          error.statusCode = 400;
          throw error;
        }
        return true;
      }),
  ],
  user.insertUser
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password", "Please enter your password").trim().isLength({ min: 5 }),
  ],
  user.loginUser
);

router.patch(
  "/reset/:userId",
  isAuth,
  [
    body("password", "Please enter a password").trim().isLength({ min: 5 }),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        const comparison = value.localeCompare(req.body.password);
        if (comparison !== 0) {
          const error = new Error("Las contraseñas deben ser iguales");
          error.codigo = "g268";
          error.statusCode = 400;
          throw error;
        }
        return true;
      }),
    check("userId").custom(async (value, { req }) => {
      try {
        const userFound = await User.findOne({ _id: new ObjectId(value) });
        if (!userFound) {
          const error = new Error("Este usuario no existe mas");
          error.statusCode = 400;
          error.codigo = "g268";
          throw error;
        }
        return true;
      } catch (err) {
        ErrorHandler(err, next);
      }
    }),
  ],
  user.resetPassword
);

router.put(
  "/users/:userId",
  [
    check("userId").custom(async (value, { req }) => {
      try {
        const userFound = await User.findOne({ _id: new ObjectId(value) });
        if (!userFound) {
          const error = new Error("Este usuario no existe mas");
          error.statusCode = 400;
          error.codigo = "g268";
          throw error;
        }
        return true;
      } catch (err) {
        ErrorHandler(err, next);
      }
    }),
  ],
  user.updateUser
);

router.delete(
  "/user/:userId",
  isAuth,
  [
    check("userId").custom(async (value, { req }) => {
      try {
        const userFound = await User.findOne({ _id: new ObjectId(value) });
        if (!userFound) {
          const error = new Error("Este usuario no existe mas");
          error.statusCode = 400;
          error.codigo = "g268";
          throw error;
        }
        return true;
      } catch (err) {
        ErrorHandler(err, next);
      }
    }),
  ],
  user.deleteUser
);

module.exports = router;
