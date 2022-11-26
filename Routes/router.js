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
} from "../Controller/tagihanController.js";
import {
  getSiswa,
  getSiswaProfile,
  siswaRegister,
  siswaLogin,
  siswaUpdate,
} from "../Controller/siswaController.js";

import express from "express";

const router = express.Router();
/// SISWA
router.get("/siswa", getSiswa);
router.get("/siswa-profile", verifyToken, getSiswaProfile);
router.post("/register-siswa", siswaRegister);
router.post("/login-siswa", siswaLogin);
router.patch("/siswa-profile-update/:id", verifyToken, siswaUpdate);
/// JURUSAN ///
router.get("/jurusan", getJurusan);
router.post("/jurusan", postJurusan);
router.delete("/jurusan/:id", deleteJurusan);
router.patch("/jurusan/:id", updateJurusan);
/// TAGIHAN ///
router.get("/tagihan", getTagihan);
router.patch("/tagihan/:id", updateTagihan);
router.delete("/tagihan/:id", deleteTagihan);
router.post("/tagihan", postTagihan);
/// STAF ///
router.post("/staff-register", staffRegister);
router.post("/staff-login", staffLogin);
router.get("/staff", getStaff);
router.get("/staff-profile", verifyToken, getStaffProfile);

export default router;
