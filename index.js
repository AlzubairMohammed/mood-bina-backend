const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");
const errorHander = require("./middlware/error");
var cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);
const PORT = process.env.PORT || 5000;

// load routes
const products = require("./routes/products");
const sections = require("./routes/sections");
const subSections = require("./routes/subSections");
const users = require("./routes/users");
const auth = require("./routes/auth");

// mount the router to the url's
app.use("/api/v1/auth", auth);
app.use("/api/v1/products", products);
app.use("/api/v1/sections", sections);
app.use("/api/v1/subsections", subSections);
app.use("/api/v1/users", users);
app.use(errorHander);
app.listen(PORT, async () => {
  console.log(`Server Started on ${PORT}...`);
  await sequelize.authenticate();
  console.log("Database connected ...");
});
