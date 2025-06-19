import {
  getJurusan,
  postJurusan,
  deleteJurusan,
  updateJurusan,
} from "../Controller/jurusanController.js";
import {
  getAllInvoiceIn,
  getInvoice,
  getInvoiceMe,
} from "../Controller/InvoiceInController.js";
import {
  staffRegister,
  getStaff,
  staffLogin,
  getStaffProfile,
  dashboardStaffReport,
  staffProfileUpdate,
  dashboardDevReport,
  staffProfileMeUpdate,
  getListFiles,
  getFileByDownload,
  deleteFile,
  databaseBackup,
  serverInfo,
} from "../Controller/staffController.js";
import {verifyToken} from "../middleWare/verifyToken.js";
import {
  getSiswa,
  getSiswaProfile,
  siswaRegister,
  siswaLogin,
  siswaUpdate,
  getSiswaById,
  importAccount,
  bulkStatusSiswaUpdate,
  bulkStatusKelasSiswa,
} from "../Controller/siswaController.js";
import {
  createTagihanFix,
  getTagihanFix,
  getTagihanFixForStudent,
  getTagihanFixForTU,
  getTahunAngkatan,
  getTotalTagihanFix,
  updateTagihanFix,
} from "../Controller/tagihanFixController.js";
import {postInvoiceIn} from "../Controller/InvoiceInController.js";
import {getActivity} from "../Controller/logActivity.js";
import multer from "multer";
import express from "express";
import {
  downloadTemplateImportSiswa,
  downloadTransactionIn,
  downloadStudentBill,
  downloadTransactionOut,
  // bulkPrintSuratTagihanSiswa,
} from "../Controller/download.js";
import {
  deleteCampaign,
  getAllCampaign,
  getCampaign,
  patchCampaign,
  postCampaign,
} from "../Controller/campaignController.js";
import {
  deleteResponseCampaign,
  getResponseCampaign,
  postResponseCampaign,
} from "../Controller/responseCampaignController.js";
import {
  deleteNews,
  getNews,
  getMyNews,
  getMyNewsById,
  getNewsImage,
  getNewsThumbnailImage,
  getNewsById,
  getPublicNewsById,
  getRecommendedNews,
  getRecomendedPublicNews,
  postNews,
  reactionNews,
  storeNewsImage,
  updateNews,
  getPublicNews,
} from "../Controller/newsController.js";
import {
  getAllInvoiceOut,
  postInvoiceOut,
} from "../Controller/InvoiceOutController.js";
import {
  deleteNewsComment,
  getCommentByNewsId,
  postNewsComment,
  reactionComment,
} from "../Controller/newsCommentController.js";

const router = express.Router();
const storageImportSiswa = multer.diskStorage({
  destination: (req, file, callback) => {
    /// https://stackoverflow.com/a/70855427/18038473
    callback(null, "./Assets/upload");
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});
const storageNewsContentImage = multer.diskStorage({
  destination: (req, file, callback) => {
    /// https://stackoverflow.com/a/70855427/18038473
    callback(null, "./Assets/news/content");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      `PRE_${Date.now()}_${file.originalname?.replaceAll(" ", "-")}`
    );
  },
});
const storagethumbnail = multer.diskStorage({
  destination: (req, file, callback) => {
    /// https://stackoverflow.com/a/70855427/18038473
    callback(null, "./Assets/news/thumbnail");
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}_${file.originalname?.replaceAll(" ", "-")}`);
  },
});

const uploadSiswa = multer({storage: storageImportSiswa});
const newsImageImage = multer({storage: storageNewsContentImage});
const thumbnailNews = multer({storage: storagethumbnail});
/// SISWA
router.get("/siswa", verifyToken, getSiswa);
router.get("/siswa/:id", verifyToken, getSiswaById);
router.get("/siswa-profile", verifyToken, getSiswaProfile);
router.post("/register-siswa", siswaRegister);
router.post(
  "/import-akun-siswa",
  uploadSiswa.single("xlsx"),
  verifyToken,
  importAccount
);
router.post("/login-siswa", siswaLogin);
router.patch(
  /// https://stackoverflow.com/a/15129057/18038473

  "/bulk-siswa-update/:ids",
  verifyToken,
  bulkStatusSiswaUpdate
);
router.patch("/siswa/:id", verifyToken, siswaUpdate);
/// https://stackoverflow.com/a/15129057/18038473
router.patch(
  "/status-kelas/:current_jurusan/:current_sub_kelas/:current_kelas",
  verifyToken,
  bulkStatusKelasSiswa
);
// router.patch("/siswa/:id", verifyToken, siswaUpdate);
/// JURUSAN ///
router.get("/jurusan", getJurusan);
router.post("/jurusan", verifyToken, postJurusan);
router.delete("/jurusan/:id", verifyToken, deleteJurusan);
router.patch("/jurusan/:id", verifyToken, updateJurusan);
/// TAGIHAN ///
router.patch("/tagihan-permanent/:id", verifyToken, updateTagihanFix);
router.post("/tagihan-permanent", verifyToken, createTagihanFix);
router.get("/tagihan-permanent", verifyToken, getTagihanFix);
router.get("/total-tagihan-permanent", verifyToken, getTotalTagihanFix);
router.get("/tagihan-permanent-siswa", verifyToken, getTagihanFixForTU);
router.get("/tagihan-permanent-siswa-me", verifyToken, getTagihanFixForStudent);
router.get("/tahun-angkatan", verifyToken, getTahunAngkatan);
/// STAF ///
router.post("/staff-register", staffRegister);
router.post("/staff-login", staffLogin);
router.get("/staff", verifyToken, getStaff);
router.patch("/staff/:id", verifyToken, staffProfileUpdate);
router.get("/staff-profile", verifyToken, getStaffProfile);
router.patch("/staff-profile/:id", verifyToken, staffProfileMeUpdate);
router.post("/campaign", verifyToken, postCampaign);
router.post("/response-campaign", verifyToken, postResponseCampaign);
router.delete("/response-campaign/:id", verifyToken, deleteResponseCampaign);
router.get("/response-campaign", verifyToken, getResponseCampaign);
router.get("/campaign", verifyToken, getAllCampaign);
router.get("/campaign-me", verifyToken, getCampaign);
router.patch("/campaign/:id", verifyToken, patchCampaign);
router.delete("/campaign/:id", verifyToken, deleteCampaign);
router.post(
  "/news-image",
  newsImageImage.single("img"),
  verifyToken,
  storeNewsImage
);
router.get("/news", verifyToken, getNews);
router.delete("/news-comment/:id", verifyToken, deleteNewsComment);
/// RECOMANDED NEWS
router.get("/news-recommended/:id", verifyToken, getRecommendedNews);
router.get("/news-public-recommended/:id", getRecomendedPublicNews);

/// REACTION
router.get("/news-reaction/:news_id/:type_vote", verifyToken, reactionNews);
router.get(
  "/news-comment-reaction/:news_comment_id/:type_vote",
  verifyToken,
  reactionComment
);
router.post("/news-comment", verifyToken, postNewsComment);
router.get("/public-news/:id", getPublicNewsById);
router.get("/public-news", getPublicNews);
router.get("/private-news/:id", verifyToken, getNewsById);
router.get("/news-comment/:id", getCommentByNewsId);
router.post(
  "/my-news",
  thumbnailNews.single("thumbnail"),
  verifyToken,
  postNews
);
router.delete("/my-news/:id", verifyToken, deleteNews);
router.get("/my-news/:id", verifyToken, getMyNewsById);
router.patch(
  "/my-news/:id",
  thumbnailNews.single("thumbnail"),
  verifyToken,
  updateNews
);
router.get("/my-news", verifyToken, getMyNews);
router.get("/news-image/:img", getNewsImage);
router.get("/news-thumbnail/:img", getNewsThumbnailImage);
/// INVOICE ///
router.post("/invoice-in", verifyToken, postInvoiceIn);
router.get("/get-all-invoice-in", verifyToken, getAllInvoiceIn);
router.post("/invoice-out", verifyToken, postInvoiceOut);
router.get("/get-all-invoice-out", verifyToken, getAllInvoiceOut);
router.get("/invoice", verifyToken, getInvoice);
router.get("/invoice-me", verifyToken, getInvoiceMe);

/// DOWNLOAD
router.get("/download/template-import-siswa", downloadTemplateImportSiswa);
// router.get(
//   "/download/bulk-print-surat-tagihan-siswa",
//   bulkPrintSuratTagihanSiswa
// );
router.get(
  "/download/report-transaction-in",
  verifyToken,
  downloadTransactionIn
);
router.get(
  "/download/report-transaction-out",
  verifyToken,
  downloadTransactionOut
);
router.get("/download/report-bill", verifyToken, downloadStudentBill);

/// DASHBOARD REPOST
router.get("/dashboard-report", verifyToken, dashboardStaffReport);

/// DEV
router.get("/log", verifyToken, getActivity);
router.get("/dashboard-dev", verifyToken, dashboardDevReport);
router.get("/files", verifyToken, getListFiles);
router.get("/download-files", verifyToken, getFileByDownload);
router.get("/delete-files", verifyToken, deleteFile);
router.get("/database-backup", verifyToken, databaseBackup);
router.get("/server-info", verifyToken, serverInfo);

export default router;
