
const request = require("supertest");
const { app } = require("../src/app");

describe("TaskMaster Pro API", () => {
  test("GET /health returns 200", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.service).toBe("taskmaster-pro");
  });

  test("GET /api/tasks rejects unauthenticated requests", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  test("POST /api/auth/register rejects numeric email", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: 123,
        password: "test123456",
        name: "Test"
      });

    expect(response.status).toBe(400);
  });

  test("POST /api/auth/register rejects numeric name", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@example.com",
        password: "test123456",
        name: 123
      });

    expect(response.status).toBe(400);
  });

  test("POST /api/auth/login rejects numeric email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: 123,
        password: "test123456"
      });

    expect(response.status).toBe(400);
  });
});
