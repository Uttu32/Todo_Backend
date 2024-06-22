const Joi = require("joi");
const mongoose = require("mongoose");
const todoValidatorSchema = require("../validators/todoValidator");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Progress", "Completed"],
    default: "Pending",
  },
});

// Exclude internal fields during conversion to JSON
todoSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

todoSchema.pre("save", function (next) {
  const dataToValidate = {
    title: this.title,
    description: this.description,
    status: this.status || "Pending",
  };

  const validationResult = todoValidatorSchema.validate(dataToValidate);

  if (validationResult.error) {
    return next(validationResult.error);
  }

  next();
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
