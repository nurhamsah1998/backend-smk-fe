import { stafAuth } from "../Models/staf.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

export const getStaff = async (req, res) => {
  try {
    const response = await stafAuth.findAll();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};
export const getStaffProfile = async (req, res) => {
  const decodedTokenFromClient = jwt.decode(
    req.headers.authorization.replace("Bearer ", "")
  );
  try {
    const response = await stafAuth.findOne({
      attributes: { exclude: ["password"] },
      where: {
        id: decodedTokenFromClient.idStaff,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

export const staffRegister = async (req, res) => {
  const { nama, username, password, noHP, role } = req.body;
  const salt = await bcrypt.genSalt();
  const securePassword = await bcrypt.hash(password, salt);
  //   const EncryptNISN = CryptoJS.AES.encrypt(
  //     nisn,
  //     process.env.SECRET_ENCRYPT
  //   ).toString();
  try {
    // const NISN = await stafAuth.findAll({
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
    await stafAuth.create({
      nama: nama,
      username: username,
      password: securePassword,
      noHP: noHP,
      role: role,
    });
    res.status(201).json({ msg: "Pendaftaran berhasil" });
  } catch (error) {
    console.log(error);
    if (error.name.includes("SequelizeUniqueConstraintError"))
      return res.status(403).json({ msg: "Username sudah terdaftar" });
  }
};

export const staffLogin = async (req, res) => {
  try {
    // const NISN = await stafAuth.findAll();
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
    const staff = await stafAuth.findAll({
      where: {
        username: req.body.username,
      },
    });
    console.log(staff, "oop");
    const isMatchPassword = await bcrypt.compare(
      req.body.password,
      staff[0].password
    );
    if (!isMatchPassword)
      return res.status(400).json({ msg: "Periksa password anda" });
    const idStaff = staff[0].id;
    const namaStaff = staff[0].nama;
    const usernameStaff = staff[0].username;
    const accessToken = jwt.sign(
      {
        idStaff,
        namaStaff,
        usernameStaff,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "7d",
      }
    );
    res.json({ msg: "Login berhasil", accessToken });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Akun tidak ditemukan" });
  }
};
