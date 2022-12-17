import express from "express";
import router from "./Routes/router.js";
import database from "./Configuration/database.js";
import dotEnv from "dotenv";
import cors from "cors";
import { jurusan } from "./Models/jurusan.js";
import { tagihan } from "./Models/tagihan.js";
import { siswaAuth } from "./Models/siswa.js";
import { stafAuth } from "./Models/staf.js";
import { invoice } from "./Models/invoice.js";
import { tagihanFix } from "./Models/tagihanFix.js";

dotEnv.config();
const app = express();
const port = 5000;
const messageServerStart = `Server start on port ${port}.`;

try {
  await database.authenticate();
  // await jurusan.sync();
  // await tagihan.sync();
  // await siswaAuth.sync();
  // await invoice.sync();
  // await stafAuth.sync();
  // await tagihanFix.sync();
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
