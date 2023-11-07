const path = require("path");
const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

dotenv.config();

//const MONGODB_URL = process.env.MONGO_URL;

const MONGODB_URL = "mongodb://mongoroshka/roshka";

const example = require("./routers/example");
const ultimaHora = require("./routers/ultimaHora");
const user = require("./routers/users");

dotenv.config();

const PORT = process.env.PORT || 9090;

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(bodyParser.json());
app.use(helmet({ crossOriginIsolated: false }));
app.use(morgan("combined", { stream: accessLogStream }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api", example);
app.use("/api", ultimaHora);
app.use("/api", user);

app.use((error, rq, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const codigo = error.codigo;
  const data = error.data;
  res.status(status).json({ codigo: codigo, error: message, data: data });
});

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    app.listen(PORT, function () {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
