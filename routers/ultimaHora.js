const express = require("express");
const router = express.Router();
const ultimaHora = require("../controllers/ultimaHora");
const isAuth = require("../middleware/isAuth");
const { check } = require("express-validator");

router.get(
  "/ultimaHora",
  isAuth,
  [
    check("q").custom((value, { req }) => {
      if (!value) {
        const error = new Error("Parámetros inválidos");
        error.statusCode = 400;
        error.codigo = "g268";
        throw error;
      }
      return true;
    }),
  ],
  ultimaHora.getNoticiasByQuery
);

module.exports = router;
