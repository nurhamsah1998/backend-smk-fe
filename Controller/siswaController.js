import { siswaAuth } from "../Models/siswa.js";
import bcrypt from "bcrypt";
import { jurusan } from "../Models/jurusan.js";
import jwt from "jsonwebtoken";

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
  try {
    const response = await siswaAuth.create({
      nama: nama,
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
      return res
        .status(403)
        .json({ msg: "Nomor NISN sudah terdaftar didatabase kami" });
  }
};

export const siswaLogin = async (req, res) => {
  try {
    const siswa = await siswaAuth.findAll({
      where: {
        nisn: req.body.nisn,
      },
    });
    const isMatchPassword = await bcrypt.compare(
      req.body.password,
      siswa[0].password
    );
    if (!isMatchPassword)
      return res.status(400).json({ msg: "Periksa password anda" });
    const idSiswa = siswa[0].id;
    const namaSiswa = siswa[0].name;
    const nisnSiswa = siswa[0].nisn;
    const tahunAngkatanSiswa = siswa[0].angkatan;
    const idJurusanSiswa = siswa[0].jurusanId;
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
    console.log(accessToken, "===");
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
  }
};
