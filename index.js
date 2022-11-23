import express from "express";
import router from "./Routes/router.js";
import database from "./Configuration/database.js";
import dotEnv from "dotenv";
import { jurusan } from "./Models/jurusan.js";
import { tagihan } from "./Models/tagihan.js";
import { siswaAuth } from "./Models/siswa.js";
import { stafAuth } from "./Models/staf.js";

dotEnv.config();
const app = express();
const port = 5000;
const messageServerStart = `Server start on port ${port}.`;

try {
  await database.authenticate();
  // await jurusan.sync();
  // await tagihan.sync();
  // await siswaAuth.sync();
  // await stafAuth.sync();
  console.log("DATABASE CONNECTED");
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(messageServerStart);
});
