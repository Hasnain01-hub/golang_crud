const express = require("express");
const router = express.Router();
const Todo = require("../model/todo.model");
const { verifyuser } = require("../middleware/auth.middleware");
const {
  fetchAllTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  clearComplete,
} = require("../controller/todo.controller");

router.get("/gettodo", verifyuser, fetchAllTodo);
router.post("/createtodo", verifyuser, createTodo);
router.post("/updatetodo", verifyuser, updateTodo);
router.get("/deletetodo/:id", verifyuser, deleteTodo);
router.delete("/clearCompletetodo", verifyuser, clearComplete);

module.exports = router;
