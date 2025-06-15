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
  getAllInvoiceOut,
  postInvoiceOut,
} from "../Controller/InvoiceOutController.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    /// https://stackoverflow.com/a/70855427/18038473
    callback(null, "./Assets/upload");
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({storage});
/// SISWA
router.get("/siswa", verifyToken, getSiswa);
router.get("/siswa/:id", verifyToken, getSiswaById);
router.get("/siswa-profile", verifyToken, getSiswaProfile);
router.post("/register-siswa", siswaRegister);
router.post(
  "/import-akun-siswa",
  upload.single("xlsx"),
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
/// INVOICE ///
router.post("/invoice-in", verifyToken, postInvoiceIn);
router.get("/get-all-invoice-in", verifyToken, getAllInvoiceIn);
router.post("/invoice-out", verifyToken, postInvoiceOut);
router.get("/get-all-invoice-out", verifyToken, getAllInvoiceOut);
router.get("/invoice", verifyToken, getInvoice);
router.get("/invoice-me", verifyToken, getInvoiceMe);

/// DOWNLOAD
router.get("/download/template-import-siswa", downloadTemplateImportSiswa);
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

export default router;
