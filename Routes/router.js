import { getJurusan, postJurusan, deleteJurusan, updateJurusan } from "../Controller/jurusanController.js";
import { getTagihan, updateTagihan, deleteTagihan, postTagihan } from "../Controller/tagihanController.js";
import { getSiswa, siswaRegister } from "../Controller/siswaController.js";
import express from "express";

const router = express.Router();

router.get("/siswa", getSiswa);
router.post("/register-siswa", siswaRegister);
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

export default router;
