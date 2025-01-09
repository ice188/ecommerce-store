<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="[https://github.com/github_username/repo_name](https://github.com/ice188/ecommerce-store)">
    <img src="img/logo.png" alt="Logo">
  </a>

  <p align="center"><br />
    Full-stack ecommerce web app built from scrtach with <br />
    React, Tailwind CSS, Express.js, PostgresSQL, Docker
    <br />
    <br />
  <a href="https://ebuyx.onrender.com">
    Project deployed on render >>
  </a>
  </p>
</div>

## Project Highlight
- fully responsive frontend powered by TailwindCSS
- secure JWT authentication and OTP verification with Node.js
- secure checkout with StripeAPI integration
- vertical slice architecture for source code modularization
- automated CI/CD pipeline using Docker and Github Actions

## Features
- User
  - register (with OTP verification)
  - login & logout (session-based authentication)
  - profile (edit and save username and shipping address)

<div align="middle">
  <img src="img/login.png" width="300" />
  <img src="img/resgiter.png" width="300" /> 
  <img src="img/account.png" width="300" /> 
</div>

- Product
  - list of all products
  - lists filtered by "most popular" and "newest arrival"
  - product detail - add to cart, customer reviews
  - search a product
 
<div align="middle">
  <img src="img/product-list.png" width="300" />
  <img src="img/product-detail.png" width="300" /> 
  <img src="img/review-list.png" width="300" /> 
  <img src="img/write-review.png" width="300" /> 
</div>

- Cart
  - view cart items, view total
  - secured checkout (Stripe API)
 
<div align="middle">
  <img src="img/cart.png" width="300" />
  <img src="img/checkout.png" width="300" /> 
</div>

- Order
  - order history and status
  - cancel pending orders
  - filter by order date and/or status

<div align="middle">
  <img src="img/order-list.png" width="300" />
</div>

## Fix Log
- Dec 14 2024: Session not persisted after logging in. Works fine locally.
  - issue: on.render.com is public domain which does not support cookies
  - solution: migrated authentication method from express-session to jwt
- Dec 18 2024: Header flyout menu not in correct state after logout
- Dec 18 2024: Cart quantity is immutable

## Side Notes
- free render databases expire in a month. Restore data by `{DATABASE_PSQL_COMMAND} < database/ebuyx_backup.sql`
