const Joi = require("joi");
const mongoose = require("mongoose");
const userValidatorSchema = require("../validators/userValidator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
  },
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

// Exclude internal fields during conversion to JSON
userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

userSchema.pre("save", function(next) {
  const dataToValidate = {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    password: this.password,
    mobileNumber: this.mobileNumber,
    token: this.token,
    resetPasswordExpires: this.resetPasswordExpires,
    todos: this.todos,
  };

  const validationResult = userValidatorSchema.validate(dataToValidate);

  if (validationResult.error) {
    return next(validationResult.error);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
