const request = require("supertest");
const app = require("../index");
const pool = require("../src/config/db");

describe("Product Routes", () => {
  let pid;
  let token;

  afterAll(async () => {
    await deleteProduct(pid);
  });

  it("should not add apple", async () => {
    const response = await request(app)
      .post("/api/product/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "apple",
        description: "crispy sweet juicy apples from a local farm",
        price: 5.12,
        stock: 100,
        img_url:
          "https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=612x612&w=0&k=20&c=NvO-bLsG0DJ_7Ii8SSVoKLurzjmV0Qi4eGfn6nW3l5w=",
      });
    expect(response.status).toBe(500);
  });

  it("should login as admin", async () => {
    const loginResponse = await request(app).post("/api/user/login").send({
      email: "admin@gmail.com",
      password: "2024",
    });
    expect(loginResponse.status).toBe(200);
    token = loginResponse.body.token;
  });

//   it("should add banana", async () => {
//     const response = await request(app)
//       .post("/api/product/")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         name: "banana",
//         description: "crispy sweet juicy apples from a local farm",
//         price: 5.21,
//         stock: 100,
//         img_url:
//           "https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=612x612&w=0&k=20&c=NvO-bLsG0DJ_7Ii8SSVoKLurzjmV0Qi4eGfn6nW3l5w=",
//       });
//       expect(response.message).toBe("123");
//     expect(response.status).toBe(200);
//     expect(response.body.product.name).toBe("banana");
//     pid = response.body.product.product_id;
//   });

  it("should logout the admin", async () => {
    const logoutResponse = await request(app)
      .post("/api/user/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.message).toBe("Logout successful");
  });

  async function deleteProduct(id) {
    await pool.query("DELETE FROM products WHERE product_id = $1", [id]);
  }
});
