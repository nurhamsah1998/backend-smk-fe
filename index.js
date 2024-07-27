import express from "express";
import router from "./Routes/router.js";
import database from "./Configuration/database.js";
import dotEnv from "dotenv";
import cors from "cors";
import { invoiceOut } from "./Models/invoiceOut.js";

dotEnv.config();
const app = express();
const port = 8000;
const messageServerStart = `Server start on port ${port}.`;

try {
  await database.authenticate();
  // await invoiceOut.sync({ force: true });
  console.log("DATABASE CONNECTED");
} catch (error) {
  console.log(error);
}
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(messageServerStart);
});
