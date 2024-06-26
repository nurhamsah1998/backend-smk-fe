import express from "express";
import router from "./Routes/router.js";
import database from "./Configuration/database.js";
import dotEnv from "dotenv";
import cors from "cors";
import { jurusan } from "./Models/jurusan.js";
import { siswaAuth } from "./Models/siswa.js";
import { stafAuth } from "./Models/staf.js";
import { invoice } from "./Models/invoice.js";
import { tagihanFix } from "./Models/tagihanFix.js";
import { logActivity } from "./Models/logActivity.js";
import { campaign } from "./Models/campaign.js";
import { responseCampaign } from "./Models/responseCampaign.js";

dotEnv.config();
const app = express();
const port = 8000;
const messageServerStart = `Server start on port ${port}.`;

try {
  await database.authenticate();
  // await jurusan.sync({ force: true });
  // await siswaAuth.sync({ force: true });
  // await invoice.sync({ force: true });
  // await stafAuth.sync({ force: true });
  // await tagihanFix.sync({ force: true });
  // await logActivity.sync({ force: true });
  // await campaign.sync();
  // await responseCampaign.sync();
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
