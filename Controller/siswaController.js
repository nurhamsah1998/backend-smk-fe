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
export const getSiswaProfile = async (req, res) => {
  const decodedTokenFromClient = jwt.decode(
    req.headers.authorization.replace("Bearer ", "")
  );
  try {
    const response = await siswaAuth.findOne({
      attributes: { exclude: ["password", "nisn"] },
      where: {
        id: decodedTokenFromClient.idSiswa,
      },
    });
    const toStringify = JSON.stringify(response);
    const toParse = JSON.parse(toStringify);
    res.json({ ...toParse, nisnSiswa: decodedTokenFromClient.nisnSiswa });
  } catch (error) {
    console.log(error);
  }
};

export const siswaRegister = async (req, res) => {
  const { nama, nisn, password, noHP, jurusanId } = req.body;
  if (nisn === "" || password === "")
    return res.status(403).json({ msg: "Form tidak boleh ada yang kosong" });
  // const salt = await bcrypt.genSalt();
  // const securePassword = await bcrypt.hash(password, salt);
  // const EncryptNISN = CryptoJS.AES.encrypt(
  //   nisn,
  //   process.env.SECRET_ENCRYPT
  // ).toString();
  try {
    // const NISN = await siswaAuth.findAll({
    //   attributes: ["nisn"],
    // });
    // const toStringify = JSON.stringify(NISN);
    // const toArray = JSON.parse(toStringify);
    // const decrypt = toArray.map((i) => {
    //   const DecryptNISN = CryptoJS.AES.decrypt(
    //     i.nisn,
    //     process.env.SECRET_ENCRYPT
    //   );
    //   const originalText = DecryptNISN.toString(CryptoJS.enc.Utf8);
    //   return { nisn: originalText };
    // });
    // const isNisinHasRegister = decrypt.find((i) => i.nisn === req.body.nisn);
    // if (isNisinHasRegister)
    //   return res.status(400).json({ msg: "NISN telah terdaftar" });
    await siswaAuth.create({
      nama: nama,
      nisn: nisn,
      password: password,
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
    // const NISN = await siswaAuth.findAll();
    // const toStringify = JSON.stringify(NISN);
    // const toArray = JSON.parse(toStringify);
    // const decrypt = toArray.map((i) => {
    //   const DecryptNISN = CryptoJS.AES.decrypt(
    //     i.nisn,
    //     process.env.SECRET_ENCRYPT
    //   );
    //   const originalText = DecryptNISN.toString(CryptoJS.enc.Utf8);
    //   return { ...i, nisn: originalText };
    // });
    // const isNisinHasRegister = decrypt.find((i) => i.nisn === req.body.nisn);
    // if (!isNisinHasRegister)
    //   return res.status(400).json({ msg: "AKUN TIDAK DITEMUKAN" });
    // const isMatchPassword = await bcrypt.compare(
    //   req.body.password,
    //   isNisinHasRegister.password
    // );
    // if (!isMatchPassword)
    //   return res.status(400).json({ msg: "Periksa password anda" });
    const findSiswa = await siswaAuth.findAll({
      where: {
        nisn: req.body.nisn,
      },
    });

    if (!findSiswa[0].password.includes(req.body.password))
      return res.status(400).json({ msg: "Periksa password anda" });
    console.log(findSiswa[0], "===");
    const idSiswa = findSiswa[0].id;
    const namaSiswa = findSiswa[0].name;
    const nisnSiswa = findSiswa[0].nisn;
    const accessToken = jwt.sign(
      {
        idSiswa,
        namaSiswa,
        nisnSiswa,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "7d",
      }
    );
    res.json({ msg: "Login berhasil", accessToken });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Akun tidak ditemukan!" });
  }
};

export const siswaUpdate = async (req, res) => {
  await siswaAuth.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ msg: "update success" });
};
