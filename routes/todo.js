const express = require("express");
const {
  createTodo,
  updateTodo,
  deleteTodo,
  getAllUserTodo,
  getAllTodo,
} = require("../controllers/todo");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.post("/create-todo", isAuthenticated, createTodo);
router.patch("/update-todo/:todoId", isAuthenticated, updateTodo);
router.delete("/delete-todo/:todoId", isAuthenticated, deleteTodo);

router.get("/all-user-todo", isAuthenticated, getAllUserTodo);
router.get("/all-todo",isAuthenticated, getAllTodo);

module.exports = router;
