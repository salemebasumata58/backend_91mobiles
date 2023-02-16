const express = require("express");
const cors = require("cors");
const connect = require("./configs/db");
const routerUser = require("./routes/user.routes");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", routerUser);
app.get("/", async (req, res) => {
  res.send("Hello its me Salem");
});

app.listen(8080, async () => {
  await connect();
  console.log("listening to 8080");
});
