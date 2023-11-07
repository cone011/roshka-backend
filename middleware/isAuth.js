const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new Error("No autorizado");
    error.statusCode = 403;
    error.codigo = "g103";
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, `${process.env.JWT_TOKEN}`);
  } catch (err) {
    err.statusCode = 500;
    err.codigo = "g100";
    err.message = "Error interno del servidor";
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("No autorizado");
    error.statusCode = 403;
    error.codigo = "g103";
    throw error;
  }

  req.idUsuario = decodedToken.idUsuario;
  next();
};
