const router = require("express").Router();
const { auth } = require("../middleware/auth");
const {
  createTask,
  listMyTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require("../controllers/task.controller");

router.use(auth);

router.post("/", createTask);
router.get("/", listMyTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
