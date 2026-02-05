const Task = require("../models/Task");
const { asyncHandler } = require("../utils/asyncHandler");

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "title is required" });
  }

  const task = await Task.create({
    title: title.trim(),
    description: description ?? "",
    status,
    priority,
    dueDate,
    owner: req.user._id
  });

  return res.status(201).json({
    task: {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      owner: task.owner,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }
  });
});

const listMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });

  return res.json({
    tasks: tasks.map((t) => ({
      id: t._id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      owner: t.owner,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }))
  });
});

const getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
  
    // ownership check
    if (String(task.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  
    return res.json({
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        owner: task.owner,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  });
  
  const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
  
    if (String(task.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  
    const allowed = ["title", "description", "status", "priority", "dueDate"];
    const updates = {};
  
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }
  
    // Validări simple
    if ("title" in updates) {
      if (!updates.title || !String(updates.title).trim()) {
        return res.status(400).json({ message: "title cannot be empty" });
      }
      updates.title = String(updates.title).trim();
    }
  
    if ("status" in updates) {
      const ok = ["todo", "in_progress", "done"].includes(updates.status);
      if (!ok) return res.status(400).json({ message: "Invalid status" });
    }
  
    if ("priority" in updates) {
      const ok = ["low", "medium", "high"].includes(updates.priority);
      if (!ok) return res.status(400).json({ message: "Invalid priority" });
    }
  
    // Aplică updates
    Object.assign(task, updates);
    await task.save();
  
    return res.json({
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        owner: task.owner,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  });
  
  const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
  
    if (String(task.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  
    await Task.deleteOne({ _id: task._id });
  
    return res.json({ ok: true });
  });
  

  module.exports = { createTask, listMyTasks, getTaskById, updateTask, deleteTask };


