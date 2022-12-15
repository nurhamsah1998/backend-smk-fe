import {
  getJurusan,
  postJurusan,
  deleteJurusan,
  updateJurusan,
} from "../Controller/jurusanController.js";
import {
  staffRegister,
  getStaff,
  staffLogin,
  getStaffProfile,
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
} from "../Controller/siswaController.js";
import {
  getTagihanFix,
  getTagihanFixForStudent,
} from "../Controller/tagihanFixController.js";
import { postInvoice } from "../Controller/InvoiceController.js";

import express from "express";

const router = express.Router();
/// SISWA
router.get("/siswa", getSiswa);
router.get("/siswa/:id", verifyToken, getSiswaById);
router.get("/siswa-profile", verifyToken, getSiswaProfile);
router.post("/register-siswa", siswaRegister);
router.post("/login-siswa", siswaLogin);
router.patch("/siswa/:id", verifyToken, siswaUpdate);
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
router.get("/tagihan-permanent", getTagihanFix);
router.get("/tagihan-permanent-siswa", getTagihanFixForStudent);
/// STAF ///
router.post("/staff-register", staffRegister);
router.post("/staff-login", staffLogin);
router.get("/staff", getStaff);
router.get("/staff-profile", verifyToken, getStaffProfile);
/// STAF ///
router.post("/invoice", verifyToken, postInvoice);

export default router;
