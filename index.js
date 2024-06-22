const express = require("express");
const { Connect } = require("./config/db");
const app = express();
require("dotenv").config();
const userRouter = require("./routes/auth");
const todoRouter = require("./routes/todo");

app.use(express.json());
app.use("/api/v1", userRouter);
app.use("/api/v1/Todo", todoRouter);

// mongodb connection
Connect();

const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.json({
    message: "App is live hello",
  });
});

app.listen(3000, () => {
  console.log(`App is running at http://localhost:${port}`);
});
