const express = require("express");
const pool = require("../config/db");
const asyncHandler = require("express-async-handler");
const userAuth = require("../middlewares/userAuth");
const router = express.Router();

// Create order
router.post(
  "/:id",
  userAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cart_id, amount } = req.body;

    const newOrder = await pool.query(
      "INSERT INTO orders (user_id, cart_id, amount, status, update_time) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *",
      [id, cart_id, amount, "pending"]
    );
    res.json({ message: "Order created", order: newOrder.rows[0] });
  })
);

// Get user orders
router.get(
  "/:id",
  userAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const orders = await pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY update_time DESC", [
      id,
    ]);
    res.json({ message: "Orders obtained", order: orders.rows });
  })
);

// Get order by order_id
router.get(
  "/specify/:order_id",
  userAuth,
  asyncHandler(async (req, res) => {
    const { order_id } = req.params;
    const order = await pool.query(
      "SELECT * FROM orders WHERE order_id = $1",
      [order_id]
    );
    res.json({ message: "Order obtained", order: order.rows[0] });
  })
);

//delete order
router.delete(
  "/:oid",
  userAuth,
  asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const deletedOrderItem = await pool.query(
      "DELETE FROM orders WHERE order_id = $1 RETURNING *",
      [oid]
    );
    return res.json({
      message: "Order deleted",
      order: deletedOrderItem.rows[0],
    });
  })
);

//change order status
router.put(
  "/:cid",
  userAuth,
  asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const { status } = req.body;

    const updatedOrder = await pool.query(
      "UPDATE orders SET status = $1 WHERE cart_id = $2 returning *",
      [status, cid]
    );
    return res.json({
      message: "Status updated",
      updatedOrder: updatedOrder.rows[0],
    });
  })
);

module.exports = router;
