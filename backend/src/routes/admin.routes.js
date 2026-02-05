const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const { listUsers, setUserRole, listAllTasks } = require("../controllers/admin.controller");

router.use(auth);
router.use(requireRole("admin"));

router.get("/users", listUsers);
router.patch("/users/:id/role", setUserRole);

router.get("/tasks", listAllTasks);

module.exports = router;
