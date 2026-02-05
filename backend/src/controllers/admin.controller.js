const User = require("../models/User");
const Task = require("../models/Task");
const { asyncHandler } = require("../utils/asyncHandler");

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("_id email role name createdAt updatedAt")
    .sort({ createdAt: -1 });

  res.json({
    users: users.map((u) => ({
      id: u._id,
      email: u.email,
      role: u.role,
      name: u.name,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }))
  });
});

const setUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();

  res.json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});

const listAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find()
    .populate("owner", "_id email role name")
    .sort({ createdAt: -1 });

  res.json({
    tasks: tasks.map((t) => ({
      id: t._id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      owner: t.owner
        ? { id: t.owner._id, email: t.owner.email, role: t.owner.role, name: t.owner.name }
        : null,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }))
  });
});

module.exports = { listUsers, setUserRole, listAllTasks };
