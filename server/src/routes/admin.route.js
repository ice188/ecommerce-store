// src/admin/admin.route.js
const express = require('express');
const pool = require('../config/db');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const adminAuth = require('../middlewares/adminAuth');

// Get all users
router.get('/users', adminAuth, asyncHandler(async (req, res) => {

    const users = await pool.query("SELECT * FROM users");
    res.json({ message: "Users obtained", user: users.rows });

}));

// Get all orders
router.get('/orders', adminAuth, asyncHandler(async (req, res) => {

    const orders = await pool.query("SELECT * FROM orders");
    res.json({ message: "Orders obtained", order: orders.rows });

}));

// Delete user
router.delete('/users/:uid', adminAuth, asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const deletedUser = await pool.query(
        "DELETE FROM users WHERE user_id = $1 RETURNING *",
        [uid]
    );

    res.json({ message: "User deleted", user: deletedUser.rows[0] });
}));

module.exports = router;
