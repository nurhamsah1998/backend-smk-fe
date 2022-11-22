import { siswaAuth } from "../Models/siswa.js";
import bcrypt from "bcrypt";

export const getSiswa = async (req, res) => {
  try {
    const response = await siswaAuth.findAll();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};
export const siswaRegister = async (req, res) => {
  const { name, nisn, password, noHP, jurusanId } = req.body;
  const salt = await bcrypt.genSalt();
  const securePassword = await bcrypt.hash(password, salt);
  try {
    const response = await siswaAuth.create({
      name: name,
      nisn: nisn,
      password: securePassword,
      noHP: noHP,
      angkatan: new Date().getFullYear(),
      jurusanId: jurusanId,
    });
    res.status(201).json({ msg: "Pendaftaran berhasil" });
  } catch (error) {
    console.log(error);
    if (error.name.includes("SequelizeUniqueConstraintError"))
      return res.status(403).json({ msg: "Nomor NISN sudah terdaftar didatabase kami" });
  }
};
