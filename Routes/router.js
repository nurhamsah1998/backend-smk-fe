import {
  getJurusan,
  postJurusan,
  deleteJurusan,
  updateJurusan,
} from "../Controller/jurusanController.js";
import { getAllInvoice, getInvoice } from "../Controller/InvoiceController.js";
import {
  staffRegister,
  getStaff,
  staffLogin,
  getStaffProfile,
  dashboardStaffReport,
} from "../Controller/staffController.js";
import { verifyToken } from "../middleWare/verifyToken.js";
import {
  getTagihan,
  updateTagihan,
  deleteTagihan,
  postTagihan,
  getTagihanBySiswa,
  getTagihanByKode,
} from "../Controller/tagihanController.js";
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
  getTagihanFix,
  getTagihanFixForStudent,
  getTotalTagihanFix,
  updateTagihanFix,
} from "../Controller/tagihanFixController.js";
import { postInvoice } from "../Controller/InvoiceController.js";
import multer from "multer";
import express from "express";
import path from "path";
import { downloadTemplateImportSiswa } from "../Controller/download.js";

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

const upload = multer({ storage });
/// SISWA
router.get("/siswa", getSiswa);
router.get("/siswa/:id", verifyToken, getSiswaById);
router.get("/siswa-profile", verifyToken, getSiswaProfile);
router.post("/register-siswa", siswaRegister);
router.post("/import-akun-siswa", upload.single("xlsx"), importAccount);
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
router.post("/jurusan", postJurusan);
router.delete("/jurusan/:id", deleteJurusan);
router.patch("/jurusan/:id", updateJurusan);
/// TAGIHAN ///
router.get("/tagihan", getTagihan);
router.get("/tagihan/:kode_tagihan", getTagihanByKode);
router.patch("/tagihan/:id", updateTagihan);
router.delete("/tagihan/:id", deleteTagihan);
router.post("/tagihan", verifyToken, postTagihan);
router.get("/tagihan-siswa", verifyToken, getTagihanBySiswa);
router.patch("/tagihan-permanent/:id", updateTagihanFix);
router.get("/tagihan-permanent", getTagihanFix);
router.get("/total-tagihan-permanent", getTotalTagihanFix);
router.get("/tagihan-permanent-siswa", getTagihanFixForStudent);
/// STAF ///
router.post("/staff-register", staffRegister);
router.post("/staff-login", staffLogin);
router.get("/staff", getStaff);
router.get("/staff-profile", verifyToken, getStaffProfile);
/// INVOICE ///
router.post("/invoice", verifyToken, postInvoice);
router.get("/invoice", verifyToken, getInvoice);
router.get("/get-all-invoice", verifyToken, getAllInvoice);

/// DOWNLOAD
router.get("/download/template-import-siswa", downloadTemplateImportSiswa);

/// DASHBOARD REPOST
router.get("/dashboard-report", verifyToken, dashboardStaffReport);

export default router;
