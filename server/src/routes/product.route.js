const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const asyncHandler = require("express-async-handler");
const adminAuth = require("../middlewares/adminAuth");

// Add product (for admin)
router.post(
  "/",
  adminAuth,
  asyncHandler(async (req, res) => {
    const { name, description, price, stock, img_url } = req.body;
    const newProduct = await pool.query(
      "INSERT INTO products (name, description, price, stock, img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, price, stock, img_url]
    );
    res.json({ message: "Product added", product: newProduct.rows[0] });
  })
);

// Get products
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await pool.query("SELECT * FROM products");
    res.json({ message: "Products obtained", product: products.rows });
  })
);

// Get 6 newest products
router.get(
  "/new",
  asyncHandler(async (req, res) => {
    const newProducts = await pool.query(
      "SELECT * FROM products ORDER BY added_at DESC LIMIT 6"
    );
    res.json({
      message: "Newest products obtained",
      product: newProducts.rows,
    });
  })
);

// Get 6 most popular (most ordered) products
router.get(
  "/popular",
  asyncHandler(async (req, res) => {
    const popularProducts = await pool.query(
      `
        SELECT 
            p.product_id,
            p.name,
            p.price,
            p.img_url,
            COUNT(oi.order_id) AS order_count,           
            COALESCE(AVG(r.rating), 0) AS average_rating  
        FROM 
            products p
        LEFT JOIN 
            order_items oi ON p.product_id = oi.product_id  
        LEFT JOIN 
            reviews r ON p.product_id = r.product_id         
        GROUP BY 
            p.product_id
        ORDER BY 
            order_count DESC                                 
        LIMIT 6;                                           
    `
    );
    res.json({
      message: "Popular products obtained",
      product: popularProducts.rows,
    });
  })
);

// Get product by id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const productById = await pool.query(
      "SELECT * FROM products WHERE product_id = $1",
      [id]
    );
    res.json({
      message: "Product with id obtained",
      product: productById.rows[0],
    });
  })
);

// Update product
router.put(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, img_url } = req.body;
    const updatedProduct = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, stock = $4, img_url = $5 WHERE product_id = $6 RETURNING *",
      [name, description, price, stock, img_url, id]
    );
    res.json({ message: "Product updated", product: updatedProduct.rows[0] });
  })
);

// Delete product
router.delete(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await pool.query(
      "DELETE FROM products WHERE product_id = $1 RETURNING *",
      [id]
    );
    if (deletedProduct.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted", product: deletedProduct.rows[0] });
  })
);

module.exports = router;
