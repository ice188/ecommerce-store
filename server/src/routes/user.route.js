const express = require("express");
const pool = require("../config/db");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const userAuth = require("../middlewares/userAuth");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// 1. Register user
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    let { username, email, password, role_id } = req.body;
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Account already exists." });
    }
    username = username || "Anonymous";
    const newUser = await pool.query(
      "INSERT INTO users(username, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password, role_id]
    );

    // create user cart
    await pool.query("INSERT INTO carts (user_id) VALUES ($1)", [
      newUser.rows[0].user_id,
    ]);
    res.json({ message: "User added", user: newUser.rows[0] });
  })
);

// 1b. Send verification code
router.post(
  "/verify",
  asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.VERIFICATION_EMAIL,
        pass: process.env.VERIFICATION_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.VERIFICATION_EMAIL,
      to: email,
      subject: "EbuyX: Your Verification Code",
      text: `Your verification code is: ${code}`,
    });
    res.status(200).json({ message: "Verification code sent." });
  })
);

// 2. Login user
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0 || user.rows[0].password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { user_id: user.rows[0].user_id, username: user.rows[0].username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "12d" }
    );
    res.json({ message: "User logged in", token: token, user: user.rows[0] });
  })
);

// 3. Logout user
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    res.json({ message: "Logout successful" });
  })
);

// 4. Get login status
router.get("/auth/status", async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.json({ isLoggedIn: false });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    decoded.user_id,
  ]);
  if (user.rows.length > 0) {
    res.json({ isLoggedIn: true, user: user.rows[0] });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// 5. Get user address
router.get(
  "/:uid/address",
  userAuth,
  asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const address = await pool.query(
      "SELECT * FROM user_addresses WHERE user_id = $1",
      [uid]
    );
    if (address.rows.length === 0) {
      return res.status(204).json({ message: "User does not have address" });
    }
    res.json({ message: "User address obtained", address: address.rows[0] });
  })
);

// 6. Save user address
router.post(
  "/:uid/address",
  userAuth,
  asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const { country, state, city, street, postal } = req.body;
    const newAddress = await pool.query(
      "INSERT into user_addresses (user_id, street, city, state, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6)",
      [uid, street, city, state, postal, country]
    );
    res.json({ message: "User address added", address: newAddress.rows[0] });
  })
);

// 6. Update user address
router.put(
  "/:uid/address",
  userAuth,
  asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const { country, state, city, street, postal } = req.body;
    const updatedAddress = await pool.query(
      `UPDATE user_addresses SET street = $1, city = $2, state = $3, postal_code = $4, country = $5 WHERE user_id = $6 RETURNING *`,
      [street, city, state, postal, country, uid]
    );

    res.json({
      message: "User address updated",
      updatedAddress: updatedAddress.rows[0],
    });
  })
);

// 7. Update username
router.put(
  "/:uid/name",
  userAuth,
  asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const { username } = req.body;
    const updatedUser = await pool.query(
      `UPDATE users SET username = $1 WHERE user_id = $2 RETURNING *`,
      [username, uid]
    );
    req.session.user.username = username;
    res.json({
      message: "Username updated",
      updatedUser: updatedUser.rows[0],
    });
  })
);

module.exports = router;
