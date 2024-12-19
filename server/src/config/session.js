const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db");
var environment = process.env.NODE_ENV;
var isProduction = environment === "production";

const sessionStore = session({
  store: new pgSession({
    pool: pool,
    tableName: "session",
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: isProduction,
  cookie: {
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
});

module.exports = sessionStore;
