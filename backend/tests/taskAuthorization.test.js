
const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

jest.mock("../src/models/User", () => ({
  findById: jest.fn()
}));

jest.mock("../src/models/Task", () => ({
  findById: jest.fn()
}));

const User = require("../src/models/User");
const Task = require("../src/models/Task");
const { app } = require("../src/app");

describe("Task ownership authorization", () => {
  const userA = new mongoose.Types.ObjectId();
  const userB = new mongoose.Types.ObjectId();
  const taskId = new mongoose.Types.ObjectId();

  let tokenB;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-only-secret";

    tokenB = jwt.sign(
      {},
      process.env.JWT_SECRET,
      { subject: String(userB) }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: userB,
        email: "userb@example.com",
        role: "user",
        name: "User B"
      })
    });

    Task.findById.mockResolvedValue({
      _id: taskId,
      owner: userA,
      title: "Private task",
      status: "todo",
      priority: "medium"
    });
  });

  test("User B cannot read User A's task", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(403);
  });

  test("User B cannot update User A's task", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ title: "Unauthorized change" });

    expect(response.status).toBe(403);
  });

  test("User B cannot delete User A's task", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(403);
  });

  test("User B can read their own task", async () => {
    Task.findById.mockResolvedValue({
      _id: taskId,
      owner: userB,
      title: "My task",
      status: "todo",
      priority: "medium"
    });

    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe("My task");
  });

  test("User B receives 404 for a nonexistent task", async () => {
    Task.findById.mockResolvedValue(null);

    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task not found");
  });


test("User B can update their own task", async () => {
    const ownTask = {
      _id: taskId,
      owner: userB,
      title: "Original title",
      status: "todo",
      priority: "medium",
      save: jest.fn().mockResolvedValue(undefined)
    };
  
    Task.findById.mockResolvedValue(ownTask);
  
    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: "Updated title",
        status: "in_progress"
      });
  
    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe("Updated title");
    expect(response.body.task.status).toBe("in_progress");
    expect(ownTask.save).toHaveBeenCalledTimes(1);
  });
  
  test("User B can delete their own task", async () => {
    Task.findById.mockResolvedValue({
      _id: taskId,
      owner: userB,
      title: "My task"
    });
  
    Task.deleteOne = jest.fn().mockResolvedValue({
      deletedCount: 1
    });
  
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`);
  
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Task.deleteOne).toHaveBeenCalledWith({
      _id: taskId
    });
  });


test("POST /api/tasks rejects a numeric title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: 123,
        description: "Invalid task"
      });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("title is required");
  });
  
  
});
