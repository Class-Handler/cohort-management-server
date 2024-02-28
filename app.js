// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const { isAuthenticated } = require("./middleware/jwt.middleware");
const { haveAccess } = require("./middleware/haveAccess.middleware")

// 👇 Start handling routes here
app.use("/api", require("./routes/index.routes"));

app.use("/auth", require("./routes/auth.routes"));

app.use("/api/students", require("./routes/student.routes"));

app.use("/api/cohorts", isAuthenticated, require("./routes/cohort.routes"));

app.use("/api/projects/:cohortId", isAuthenticated, haveAccess, require("./routes/project.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
