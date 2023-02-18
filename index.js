const express = require("express");
const cors = require("cors");
const connect = require("./configs/db");
const routerUser = require("./routes/user.routes");
const filesRouter = require('./routes/files.routes');
const path = require('path');
const app = express();
const PORT = 8080
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use("/users", routerUser);
app.use(filesRouter)

app.get("/", async (req, res) => {
  res.send("Hello its me Salem");
});

app.listen(PORT, async () => {
  await connect();
  console.log("listening to 8080");
});
