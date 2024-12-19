const express = require("express");
const pool = require("../config/db");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const userAuth = require("../middlewares/userAuth");

// add new cart
router.post(
  "/new/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const newCart = await pool.query(
      "INSERT INTO carts (user_id, active) VALUES ($1, true) RETURNING *",
      [id]
    );
    res.json({ message: "Cart added", newCart: newCart.rows[0] });
  })
);

// set cart active state
router.put(
  "/status/:cid",
  asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const { active } = req.body;
    const updatedCart = await pool.query(
      "UPDATE carts SET active = $1 WHERE cart_id = $2 RETURNING *",
      [active, cid]
    );
    res.json({ message: "Cart active changed", updatedCart: updatedCart.rows[0] });
  })
);

// Add item to cart
router.post(
  "/:id",
  userAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { product_id, quantity } = req.body;
    const cartId = await pool.query(
      "SELECT cart_id FROM carts WHERE user_id = $1 AND active = true",
      [id]
    );

    const existingCartItemResult = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId.rows[0].cart_id, product_id]
    );

    let updatedCartItem;
    if (existingCartItemResult.rows.length > 0) {
      updatedCartItem = await pool.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *",
        [quantity, cartId.rows[0].cart_id, product_id]
      );
      res.json({
        message: "Cart item quantity updated",
        item: updatedCartItem.rows[0],
      });
    } else {
      updatedCartItem = await pool.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
        [cartId.rows[0].cart_id, product_id, quantity]
      );
      res.json({ message: "Cart item added", item: updatedCartItem.rows[0] });
    }
  })
);

// Delete cart item
router.delete(
  "/item/:cart_item_id",
  userAuth,
  asyncHandler(async (req, res) => {
    const { cart_item_id } = req.params;
    const deletedCartItem = await pool.query(
      "DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *",
      [cart_item_id]
    );
    return res.json({
      message: "Cart item deleted",
      item: deletedCartItem.rows[0],
    });
  })
);

// Update cart item quantity
router.put(
  "/item/:cart_item_id",
  userAuth,
  asyncHandler(async (req, res) => {
    const { cart_item_id } = req.params;
    const { quantity } = req.body;

    const updatedCartItem = await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE cart_item_id = $2 RETURNING *",
      [quantity, cart_item_id]
    );
    res.json({ message: "Cart item updated", item: updatedCartItem.rows[0] });
  })
);

// Get cart items
router.get(
  "/:id",
  userAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const cart = await pool.query(
      "SELECT cart_items.*, products.name, products.price, products.img_url FROM \
        cart_items JOIN products ON cart_items.product_id = products.product_id \
        WHERE cart_id = $1\
        ORDER BY LOWER(products.name) ASC",
      [id]
    );
    res.json({ message: "Cart items obtained", item: cart.rows });
  })
);


//Get active cart id
router.get(
  "/:id/cid",
  userAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const cartId = await pool.query(
      "SELECT cart_id FROM carts WHERE user_id = $1 AND active = true",
      [id]
    );
    res.json({ message: "Cart id obtained", cid: cartId.rows[0].cart_id });
  })
);
module.exports = router;
