const express = require("express");
const taskcontroller= require('../controllers/taskcontroller');
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.post("/", authenticateToken,taskcontroller. createTask);
router.get("/", authenticateToken,taskcontroller. getTasks);
router.put("/:id", authenticateToken,taskcontroller. updateTask);
router.delete("/:id", authenticateToken,taskcontroller. deleteTask);

module.exports = router;
