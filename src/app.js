const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Hello from the test server");
});

app.use("/test2", (req, res) => {
  res.send("Hello from the test2 server");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
