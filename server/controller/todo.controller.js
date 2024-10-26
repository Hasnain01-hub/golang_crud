const Todo = require("../model/todo.model");

exports.fetchAllTodo = async (req, res) => {
  if (req.user) {
    var email = req.user.email;
    await Todo.find({ email: email }, async (err, todo) => {
      if (err) {
        console.log(err);
        res.status(401).json({
          message: "No todo found",
          success: false,
        });
      }
      if (todo.length > 0) res.json(todo);
      else res.json([]);
    });
  }
};
exports.createTodo = async (req, res) => {
  if (req.user) {
    var email = req.user.email;
    const { taskContent, desc, _id, completed } = req.body;
    console.log(taskContent, desc, _id, completed);
    const wish = new Todo(
      {
        _id: _id,
        taskContent: taskContent,
        desc: desc,
        email: email,
        completed: completed,
      },
      { ignoreUndefined: true }
    );
    await wish
      .save()
      .then(() => {
        res.json("Task saved successfully");
      })
      .catch((error) => {
        console.error("Error saving TASK:", error);
      });
  } else {
    res.message("User not found!");
  }
};

exports.updateTodo = async (req, res) => {
  const { completed, _id } = req.body;
  try {
    if (req.user) {
      const data = await Todo.findOneAndUpdate(
        { _id: _id },
        { completed: completed },
        { new: true }
      );
      if (!data) {
        res.status(401).json({
          message: "No todo found",
          success: false,
        });
        return;
      }

      res.status(200).json({ message: "Todo Updated" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.deleteTodo = async (req, res) => {
  if (req.user) {
    await Todo.findByIdAndDelete({ _id: req.params.id }, async (err, todo) => {
      if (err) {
        res.status(401).json({
          message: "No todo found",
          success: false,
        });
      }
      res.status(200).json({ message: "Todo Deleted" });
    });
  }
};
exports.clearComplete = async (req, res) => {
  if (req.user) {
    await Todo.find(
      { completed: true, email: req.user.email },
      async (err, todo) => {
        if (err) {
          res.status(401).json({
            message: "No todo found",
            success: false,
          });
        }
        console.log(todo);
        todo.forEach(async (element) => {
          await Todo.findByIdAndRemove(
            { _id: element._id },
            async (err, todo) => {
              if (err) {
                res.status(401).json({
                  message: "No todo found",
                  success: false,
                });
              }
            }
          );
        });
        res.status(200).json({ message: "Todo Deleted" });
      }
    );
  }
};
