const express = require("express");
const pool = require("../config/db");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const userAuth = require("../middlewares/userAuth");

// Add review
router.post(
  "/:id",
  userAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { user_id, rating, comment, title } = req.body;
    
    const newReview = await pool.query(
      "INSERT INTO reviews (product_id, user_id, rating, comment, title) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, user_id, rating, comment, title]
    );
    res.json({ message: "Review added", review: newReview.rows[0] });
  })
);

// Delete review
router.delete(
  "/:pid/:rid",
  userAuth,
  asyncHandler(async (req, res) => {
    const { pid, rid } = req.params;
    const { uid } = req.body;
    const deletedReview = await pool.query(
      "DELETE FROM reviews WHERE product_id = $1 AND review_id = $2 AND user_id = $3 RETURNING *",
      [pid, rid, uid]
    );
    res.json({ message: "Review deleted", review: deletedReview.rows[0] });
  })
);

// Get all reviews
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const reviews = await pool.query("SELECT * FROM reviews");
    res.json({ message: "Reviews obtained", review: reviews.rows });
  })
);

// Get reviews for a product
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const reviews = await pool.query(
      "SELECT * FROM reviews WHERE product_id = $1 ORDER BY time DESC",
      [id]
    );
    res.json({ message: "Reviews obtained", review: reviews.rows });
  })
);

module.exports = router;
