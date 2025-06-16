import express from "express";
import router from "./Routes/router.js";
import database from "./Configuration/database.js";
import dotEnv from "dotenv";
import cors from "cors";

dotEnv.config();
const app = express();
const port = 8000;
const messageServerStart = `Server start on port ${port}.`;

try {
  await database.authenticate();
  // await database.sync();
  app.use(cors());
  app.use(express.json());
  app.use(router);

  app.listen(port, () => {
    console.log(messageServerStart);
  });
} catch (error) {
  console.log(error, "INTERNAL SERVER ERROR");
}
// ["dashboard", "log_activity", "account_staff", "major", "files", "server"]
