import express from "express";
import router from "./Routes/router.js";
import database from "./Configuration/database.js";
import dotEnv from "dotenv";
import cors from "cors";
import {campaign} from "./Models/campaign.js";
import {invoice} from "./Models/invoice.js";
import {invoiceOut} from "./Models/invoiceOut.js";
import {jurusan} from "./Models/jurusan.js";
import {logActivity} from "./Models/logActivity.js";
import {responseCampaign} from "./Models/responseCampaign.js";
import {siswaAuth} from "./Models/siswa.js";
import {stafAuth} from "./Models/staf.js";
import {tagihanFix} from "./Models/tagihanFix.js";
import {news} from "./Models/news.js";
import {newsComment} from "./Models/newsComment.js";
import {newsCommentReaction} from "./Models/newsCommentReaction.js";
import {newsReaction} from "./Models/newsReaction.js";

dotEnv.config();
const app = express();
const port = 8000;
const messageServerStart = `Server start on port ${port}.`;

try {
  await database.authenticate();
  // await invoice.sync();
  // await invoiceOut.sync();
  // await tagihanFix.sync();
  // await jurusan.sync();
  // await stafAuth.sync();
  // await siswaAuth.sync();
  // await news.sync();
  // await newsComment.sync();
  // await logActivity.sync();
  // await campaign.sync();
  // await responseCampaign.sync();
  // await newsCommentReaction.sync();
  // await newsReaction.sync();

  app.use(cors());
  app.use(express.json());
  app.use(router);

  app.listen(port, () => {
    console.log(messageServerStart);
  });
} catch (error) {
  console.log(error, "INTERNAL SERVER ERROR");
  // await database.dropAllSchemas();
}
// ["dashboard", "log_activity", "account_staff", "major", "files", "server", "news"]
