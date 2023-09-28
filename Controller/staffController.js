import { stafAuth } from "../Models/staf.js";
import bcrypt from "bcrypt";
import { invoice } from "../Models/invoice.js";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import moment from "moment/moment.js";
import { Op } from "sequelize";
import { siswaAuth } from "../Models/siswa.js";

export const dashboardStaffReport = async (req, res) => {
  try {
    const student_amount = await invoice.sum("uang_diterima", {
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment(moment().startOf("day")).format("YYYY-MM-DD H:mm:ss"),
            moment(moment().endOf("day")).format("YYYY-MM-DD H:mm:ss"),
          ],
        },
      },
    });
    const totalStudentHasPay = await invoice.count({
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment(moment().startOf("day")).format("YYYY-MM-DD H:mm:ss"),
            moment(moment().endOf("day")).format("YYYY-MM-DD H:mm:ss"),
          ],
        },
      },
    });
    const totalStudent = await siswaAuth.count();
    res.json({
      data: {
        today_profit: {
          amount: student_amount || 0,
          total_student: totalStudentHasPay || 0,
        },
        total_student: totalStudent || 0,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
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
  if (username === "" || password === "")
    return res.status(403).json({ msg: "Form tidak boleh ada yang kosong" });
  const salt = await bcrypt.genSalt();
  const securePassword = await bcrypt.hash(password, salt);
  //   const EncryptNISN = CryptoJS.AES.encrypt(
  //     nisn,
  //     process.env.SECRET_ENCRYPT
  //   ).toString();
  try {
    const uniqueUsername = await stafAuth.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (uniqueUsername)
      return res.status(403).json({ msg: "Username / email sudah terdaftar" });
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
    const isMatchPassword = await bcrypt.compare(
      req.body.password,
      staff[0].password
    );
    if (!isMatchPassword)
      return res.status(400).json({ msg: "Periksa password anda" });
    const idStaff = staff[0].id;
    const namaStaff = staff[0].nama;
    const usernameStaff = staff[0].username;
    const roleStaff = staff[0].role;
    const accessToken = jwt.sign(
      {
        idStaff,
        namaStaff,
        usernameStaff,
        roleStaff,
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
