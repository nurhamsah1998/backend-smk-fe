import { stafAuth } from "../Models/staf.js";
import bcrypt from "bcrypt";
import { invoice } from "../Models/invoice.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import { Op } from "sequelize";
import { tagihanFix } from "../Models/tagihanFix.js";
import { getUserInfoToken } from "../Configuration/supportFunction.js";

export const dashboardStaffReport = async (req, res) => {
  try {
    const student_amount_daily = await invoice.sum("uang_diterima", {
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("day").format("YYYY-MM-DD H:mm:ss"),
            moment().endOf("day").format("YYYY-MM-DD H:mm:ss"),
          ],
        },
      },
    });
    const student_amount_monthly = await invoice.sum("uang_diterima", {
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("month").format("YYYY-MM-DD H:mm:ss"),
            moment().endOf("month").format("YYYY-MM-DD H:mm:ss"),
          ],
        },
      },
    });
    const student_amount_annual = await invoice.sum("uang_diterima", {
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("year").format("YYYY-MM-DD H:mm:ss"),
            moment().endOf("year").format("YYYY-MM-DD H:mm:ss"),
          ],
        },
      },
    });
    const totalStudentHasPayDaily = await invoice.count({
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("day").format("YYYY-MM-DD H:mm:ss"),
            moment().endOf("day").format("YYYY-MM-DD H:mm:ss"),
          ],
        },
      },
    });
    const totalStudentHasPayMonthly = await invoice.count({
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("month").format("YYYY-MM-DD H:mm:ss"),
            moment().endOf("month").format("YYYY-MM-DD H:mm:ss"),
          ],
        },
      },
    });
    const totalStudentHasPayAnnual = await invoice.count({
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("year").format("YYYY-MM-DD H:mm:ss"),
            moment().endOf("year").format("YYYY-MM-DD H:mm:ss"),
          ],
        },
      },
    });
    const bill = await tagihanFix.findOne({
      raw: true,
      where: {
        tahun_angkatan: Number(moment().format("YYYY")),
      },
      attributes: {
        exclude: ["tahun_angkatan", "id", "createdAt", "updatedAt"],
      },
    });
    const totalBill = Object.values(bill || {}).reduce((a, b) => a + b, 0);
    res.json({
      data: {
        profit: {
          amount_daily: student_amount_daily || 0,
          amount_monthly: student_amount_monthly || 0,
          amount_annual: student_amount_annual || 0,
          total_student_daily: totalStudentHasPayDaily || 0,
          total_student_monthly: totalStudentHasPayMonthly || 0,
          total_student_annual: totalStudentHasPayAnnual || 0,
        },
        bill: {
          total_bill_annual: Number(totalBill),
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
export const getStaff = async (req, res) => {
  const { roleStaff } =
    getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
  if (roleStaff !== "DEV")
    return res
      .status(403)
      .json({ msg: "Akses Ditolak, Anda tidak memiliki akses!" });
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const totalData = await stafAuth.count();
  const offside = limit * page;
  const totalRows = await stafAuth.count({
    where: {
      [Op.or]: [
        {
          nama: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
    limit,
    offside,
    order: [["id", "DESC"]],
  });
  const totalPage = Math.ceil(totalRows / limit);
  try {
    const data = await stafAuth.findAll({
      where: {
        [Op.or]: [
          {
            nama: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            username: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
        role: {
          [Op.not]: "DEV",
        },
      },
      attributes: { exclude: ["password"] },
      limit,
      offside,
      order: [["id", "DESC"]],
    });
    const response = {
      data: data,
      totalPage: totalPage,
      limit: limit,
      totalRows: totalRows,
      totalData,
      page: page + 1,
    };
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
    throw error;
  }
};
export const staffProfileUpdate = async (req, res) => {
  const { role, permissions } = req.body;
  try {
    await stafAuth.update(
      { role, permissions },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Staff berhasil diupdate" });
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
