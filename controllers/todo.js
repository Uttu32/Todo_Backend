const { findByIdAndDelete } = require("../models/otp");
const Todo = require("../models/todo");
const User = require("../models/user");

// create a todo hanlder function
exports.createTodo = async (req, res) => {
  try {
    // fetch data from req body
    const { title, description } = req.body;

    // validation
    if (!title || !description) {
      return res.status(404).json({
        success: false,
        message: "Title and description must be filled",
      });
    }

    // user id
    const { id } = req.user;
    const userDetail = await User.findById(id);

    console.log("userDetail", userDetail);

    if (!userDetail) {
      return res.status(400).json({
        success: false,
        message: "Author details not found",
      });
    }
    
    const newTodo = await Todo.create({
      title,
      description,
      author: userDetail._id,
    });

    console.log("newTodo", newTodo)
    
    await User.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          todos: newTodo._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Todo created successfully",
      data: newTodo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// update todo handler function
exports.updateTodo = async (req, res) => {
  try {
    // get status, title, description and id from req body
    const { status, title, description } = req.body;
    const {todoId} = req.params;

    // getting user id
    const { id } = req.user;
    const userDetails = await User.findById(id);

    // validation
    if (!todoId) {
      return res.status(404).json({
        success: false,
        message: "Todo Id is required",
      });
    }

    // get todo using id
    const todoData = await Todo.findById(todoId);

    const checkUserCreated = userDetails.todos.includes(todoId);
    if (!checkUserCreated) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to make changes to other's todo list",
      });
    }

    if (title !== undefined) {
      todoData.title = title;
    }

    if (description !== undefined) {
      todoData.description = description;
    }

    if (status !== undefined) {
      todoData.status = status;
    }

    await todoData.save();

    return res.status(200).json({
      success: true,
      message: "Todo updated",
      data: todoData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// delete todo handler function
exports.deleteTodo = async (req, res) => {
  try {
    // get id of todo from req body
    const { todoId } = req.params;
    // get user id
    const { id } = req.user;
    // get user data
    const userDetails = await User.findById(id);

    const checkUserRights = userDetails.todos.includes(todoId);
    if (!checkUserRights) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to delete other's todo",
      });
    }

    // delete todo
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    // update user db
    const updatedUserDetails = await User.findByIdAndUpdate(
      { _id: id },
      {
        $pull: {
          todos: todoId,
        },
      },
      {
        new: true,
      }
    ).populate("todos");

    return res.status(200).json({
      success: true,
      message: "Todo Deleted Successfully",
      data: updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get all login user's todo handler function
exports.getAllUserTodo = async (req, res) => {
  try {
    // getting userid
    const { id } = req.user;

    const allTodoOfLoginUser = await User.findById(id)
      .select("todos")
      .populate("todos");

    return res.status(200).json({
      success: true,
      message: "All todo of login user is here",
      data: allTodoOfLoginUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get all todo present in db
exports.getAllTodo = async (req, res) => {
  try {
    const todoData = await Todo.find({});

    return res.status(200).json({
      success: true,
      message: "All Todo are here",
      data: todoData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
