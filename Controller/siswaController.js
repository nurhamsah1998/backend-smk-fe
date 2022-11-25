import { siswaAuth } from "../Models/siswa.js";
import bcrypt from "bcrypt";
import { jurusan } from "../Models/jurusan.js";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

export const getSiswa = async (req, res) => {
  try {
    const response = await siswaAuth.findAll({
      include: [{ model: jurusan }],
    });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};
export const siswaRegister = async (req, res) => {
  const { nama, nisn, password, noHP, jurusanId } = req.body;
  const salt = await bcrypt.genSalt();
  const securePassword = await bcrypt.hash(password, salt);
  const EncryptNISN = CryptoJS.AES.encrypt(
    nisn,
    process.env.SECRET_ENCRYPT
  ).toString();
  try {
    const NISN = await siswaAuth.findAll({
      attributes: ["nisn"],
    });
    const toStringify = JSON.stringify(NISN);
    const toArray = JSON.parse(toStringify);
    const decrypt = toArray.map((i) => {
      const DecryptNISN = CryptoJS.AES.decrypt(
        i.nisn,
        process.env.SECRET_ENCRYPT
      );
      const originalText = DecryptNISN.toString(CryptoJS.enc.Utf8);
      return { nisn: originalText };
    });
    const isNisinHasRegister = decrypt.find((i) => i.nisn === req.body.nisn);
    if (isNisinHasRegister)
      return res.status(400).json({ msg: "NISN telah terdaftar" });
    await siswaAuth.create({
      nama: nama,
      nisn: EncryptNISN,
      password: securePassword,
      noHP: noHP,
      angkatan: new Date().getFullYear(),
      jurusanId: jurusanId,
    });
    res.status(201).json({ msg: "Pendaftaran berhasil" });
  } catch (error) {
    console.log(error);
    if (error.name.includes("SequelizeUniqueConstraintError"))
      return res.status(403).json({ msg: "Nomor NISN sudah terdaftar" });
  }
};

export const siswaLogin = async (req, res) => {
  try {
    const NISN = await siswaAuth.findAll();
    const toStringify = JSON.stringify(NISN);
    const toArray = JSON.parse(toStringify);
    const decrypt = toArray.map((i) => {
      const DecryptNISN = CryptoJS.AES.decrypt(
        i.nisn,
        process.env.SECRET_ENCRYPT
      );
      const originalText = DecryptNISN.toString(CryptoJS.enc.Utf8);
      return { ...i, nisn: originalText };
    });
    const isNisinHasRegister = decrypt.find((i) => i.nisn === req.body.nisn);
    if (!isNisinHasRegister)
      return res.status(400).json({ msg: "AKUN TIDAK DITEMUKAN" });
    const isMatchPassword = await bcrypt.compare(
      req.body.password,
      isNisinHasRegister.password
    );
    if (!isMatchPassword)
      return res.status(400).json({ msg: "Periksa password anda" });
    const idSiswa = isNisinHasRegister.id;
    const namaSiswa = isNisinHasRegister.name;
    const nisnSiswa = isNisinHasRegister.nisn;
    const tahunAngkatanSiswa = isNisinHasRegister.angkatan;
    const idJurusanSiswa = isNisinHasRegister.jurusanId;
    const namaJurusanSiswa = await jurusan.findOne({
      where: {
        id: idJurusanSiswa,
      },
    });
    const accessToken = jwt.sign(
      {
        idSiswa,
        namaSiswa,
        nisnSiswa,
        tahunAngkatanSiswa,
        namaJurusanSiswa,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "7d",
      }
    );
    res.json({ msg: "Login berhasil", accessToken });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "internal server error 500" });
  }
};
