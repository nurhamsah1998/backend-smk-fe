import {stafAuth} from "../Models/staf.js";
import bcrypt from "bcrypt";
import {invoice} from "../Models/invoice.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import {tagihanFix} from "../Models/tagihanFix.js";
import {Op} from "sequelize";
import fs from "fs";
import {
  getTotalTagihan,
  getUserInfoToken,
  isEmptyString,
  recordActivity,
  upTimeFormatter,
} from "../Configuration/supportFunction.js";
import database from "../Configuration/database.js";
import {jurusan} from "../Models/jurusan.js";
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import {exec} from "child_process";
import dotEnv from "dotenv";
import sys from "systeminformation";
import os from "os";

dotEnv.config();

export const dashboardStaffReport = async (req, res) => {
  try {
    const student_amount_daily = await invoice.sum("uang_diterima", {
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("day").toISOString(),
            moment().endOf("day").toISOString(),
          ],
        },
      },
    });
    const student_amount_monthly = await invoice.sum("uang_diterima", {
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("month").toISOString(),
            moment().endOf("month").toISOString(),
          ],
        },
      },
    });
    const student_amount_annual = await invoice.sum("uang_diterima", {
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("year").toISOString(),
            moment().endOf("year").toISOString(),
          ],
        },
      },
    });
    const totalStudentHasPayDaily = await invoice.count({
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("day").toISOString(),
            moment().endOf("day").toISOString(),
          ],
        },
      },
    });
    const totalStudentHasPayMonthly = await invoice.count({
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("month").toISOString(),
            moment().endOf("month").toISOString(),
          ],
        },
      },
    });
    const totalStudentHasPayAnnual = await invoice.count({
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("year").toISOString(),
            moment().endOf("year").toISOString(),
          ],
        },
      },
    });
    const getYear = moment().format("YYYY");
    const firstGrade = Number(getYear);
    const secondGrade = Number(getYear) - 1;
    const thirhGrade = Number(getYear) - 2;
    const bill = await tagihanFix.findAll({
      raw: true,
      where: {
        tahun_angkatan: {
          [Op.in]: [thirhGrade, secondGrade, firstGrade],
        },
      },
      attributes: {
        exclude: ["id", "createdAt", "updatedAt"],
      },
    });
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
        total_bill: {
          [firstGrade]: getTotalTagihan(bill, firstGrade),
          [secondGrade]: getTotalTagihan(bill, secondGrade),
          [thirhGrade]: getTotalTagihan(bill, thirhGrade),
        },
      },
    });
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};
export const dashboardDevReport = async (req, res) => {
  try {
    const major = await jurusan.findAll({raw: true});
    const [tahun_angkatan] = await database.query(
      `select distinct(angkatan) from siswa order by angkatan asc`
    );
    let data = {};
    const [totalAnualMajor] = await database.query(
      `select count(s.jurusanId) as total, j.nama, s.angkatan, j.kode_jurusan 
       from siswa s 
       right join jurusan j 
       on s.jurusanId = j.id 
       GROUP by s.jurusanId, s.angkatan 
       order by s.angkatan asc`
    );
    for (let x = 0; x < major.length; x++) {
      /// ASSIGN JURUSAN
      const elementMajor = major[x];
      /// DEFINE VALUE JURUSAN
      data[elementMajor?.kode_jurusan] = [];
      /// PUSHING TAHUN ANGKATAN
      for (let z = 0; z < tahun_angkatan.length; z++) {
        const elementAngkatan = tahun_angkatan[z]?.angkatan;
        let totalStudentByMajor = 0;
        for (let y = 0; y < totalAnualMajor.length; y++) {
          const elementDB = totalAnualMajor[y];
          /// MERGING TOTAL STUDENT BY ANGKATAN AND KODE JURUSAN
          if (
            elementMajor?.kode_jurusan === elementDB?.kode_jurusan &&
            elementAngkatan === elementDB?.angkatan
          ) {
            totalStudentByMajor = elementDB?.total;
          }
        }
        data[elementMajor?.kode_jurusan].push(totalStudentByMajor);
      }
    }
    res.status(200).json({
      data: {
        tahun_angkatan: tahun_angkatan?.map((item) => item?.angkatan),
        analytics: data,
      },
    });
  } catch (error) {
    res.status(500).json({msg: "Internal server error"});
  }
};

export const getListFiles = async (req, res) => {
  try {
    const {roleStaff} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    if (roleStaff !== "DEV")
      return res
        .status(403)
        .json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});

    const fileName = fileURLToPath(import.meta.url);
    const __dirname = dirname(fileName);
    const listFolders = ["download", "template", "upload", "backup"];
    ///
    let listFiles = [];
    for (let index = 0; index < listFolders.length; index++) {
      const folder = listFolders[index];
      const fileLocation = `../Assets/${folder}`;
      const folderPath = path.join(__dirname, fileLocation);
      try {
        const files = await fs.promises.readdir(folderPath);
        listFiles = listFiles.concat(
          files?.map((item) => ({
            fileName: item,
            fileLocation: `${folder}/${item}`,
          }))
        );
      } catch (error) {
        return res.status(500).json({msg: "Internal server error"});
      }
    }
    res.status(200).json({files: listFiles});
    ///
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const getFileByDownload = async (req, res) => {
  try {
    const {roleStaff} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    if (roleStaff !== "DEV")
      return res
        .status(403)
        .json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
    await res.download(path.resolve(`./Assets/${req.query.path}`));
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const deleteFile = async (req, res) => {
  try {
    const {roleStaff} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    if (roleStaff !== "DEV") {
      res.status(403).json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
    }

    fs.unlink(`./Assets/${req.query.path}`, (error) => {
      throw error;
    });
    res.status(200).json({msg: `File berhasil dihapus`});
  } catch (error) {
    res.status(500).json({msg: error?.message});
    res.status(400).json({msg: `File gagal dihapus`});
  }
};

export const databaseBackup = async (req, res) => {
  try {
    const {roleStaff} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    if (roleStaff !== "DEV") {
      res.status(403).json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
    }
    const timeStamp = new Date();
    const filePath = path.resolve(
      `./Assets/backup/backup-smk-payment-app-${timeStamp
        .toLocaleDateString()
        ?.replaceAll("/", "_")}_${timeStamp.getSeconds()}.sql`
    );
    let dbPass = "";
    if (process.env.DB_PASSWORD) {
      dbPass = `-p${process.env.DB_PASSWORD} `;
    }
    exec(
      `mysqldump -u root ${dbPass}${process.env.DB_NAME} > "${filePath}"`,
      (error) => {
        if (error) {
          throw error;
          return res.status(400).json({msg: "Gagal backup database!"});
        }

        res.download(filePath);
      }
    );
  } catch (error) {
    res.status(400).json({msg: error?.message || "Internal server error"});
  }
};

export const serverInfo = async (req, res) => {
  try {
    const {roleStaff} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    if (roleStaff !== "DEV") {
      res.status(403).json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
    }
    const cpu = await sys.cpu();
    const {total, free, used} = await sys.mem();
    const up_time = os.uptime();

    res.status(200).json({
      cpu,
      up_time: upTimeFormatter(up_time),
      memory: {
        total: `${(total / 1024 / 1024).toFixed(2)} MB`,
        free: `${(free / 1024 / 1024).toFixed(2)} MB`,
        used: `${(used / 1024 / 1024).toFixed(2)} MB`,
      },
    });
  } catch (error) {
    res.status(400).json({msg: error?.message || "Internal server error"});
  }
};

export const getStaff = async (req, res) => {
  const {roleStaff} =
    getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
  if (roleStaff !== "DEV")
    return res
      .status(403)
      .json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
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
      attributes: {exclude: ["password"]},
      limit,
      offside,
      order: [["id", "DESC"]],
    });
    const response = {
      data: data,
      totalPage: totalPage,
      limit: limit,
      totalRows: totalRows,
      totalData: totalData - 1,
      page: page + 1,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};
export const getStaffProfile = async (req, res) => {
  const decodedTokenFromClient = jwt.decode(
    req.headers.authorization.replace("Bearer ", "")
  );
  try {
    const response = await stafAuth.findOne({
      attributes: {exclude: ["password"]},
      where: {
        id: decodedTokenFromClient.idStaff,
      },
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};
export const staffProfileMeUpdate = async (req, res) => {
  try {
    const {namaStaff, idStaff} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    const {nama} = req.body;
    if (req.params.id !== idStaff) {
      return res.status(404).json({msg: "Id staff tidak sama"});
    }
    if (String(nama).length >= 35) {
      return res.status(404).json({msg: "Nama terlalu panjang"});
    }
    if (isEmptyString(nama)) {
      return res.status(404).json({msg: "Nama tidak boleh kosong"});
    }
    await stafAuth.update(
      {nama},
      {
        where: {
          id: idStaff,
        },
      }
    );
    recordActivity({
      action: "Mengubah nama profile",
      author: getUserInfoToken(
        req.headers.authorization.replace("Bearer ", "")
      ),
      data: {nama_lama_pertama: namaStaff, nama_baru: nama},
    });
    res.status(200).json({msg: "Staff berhasil diupdate"});
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};
export const staffProfileUpdate = async (req, res) => {
  try {
    const {role, permissions, name} = req.body;
    await stafAuth.update(
      {role, permissions},
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({msg: "Staff berhasil diupdate"});
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const staffRegister = async (req, res) => {
  try {
    const {nama, username, password, noHP} = req.body;
    if (username?.includes(" ")) {
      return res
        .status(404)
        .json({msg: "Username / email tidak boleh ada spasi"});
    }
    if (username === "" || password === "")
      return res.status(403).json({msg: "Form tidak boleh ada yang kosong"});
    if (password?.length < 6)
      return res
        .status(404)
        .json({msg: "Password setidaknya lebih atau sama dengan 6 karakter"});

    if (
      (noHP && String(noHP)?.length >= 12) ||
      (noHP && String(noHP)?.length <= 8)
    ) {
      return res
        .status(404)
        .json({msg: "No HP tidak valid, max digit 12 min digit 8"});
    }
    const salt = await bcrypt.genSalt();
    const securePassword = await bcrypt.hash(password, salt);
    const uniqueUsername = await stafAuth.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (uniqueUsername)
      return res.status(403).json({msg: "Username / email sudah terdaftar"});

    await stafAuth.create({
      nama: nama,
      username: username,
      password: securePassword,
      noHP: noHP,
    });
    res.status(201).json({msg: "Pendaftaran berhasil"});
  } catch (error) {
    res.status(500).json({msg: error?.message});
    if (error.name.includes("SequelizeUniqueConstraintError"))
      return res.status(403).json({msg: "Username sudah terdaftar"});
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
      return res.status(400).json({msg: "Periksa password anda"});
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
    res.json({msg: "Login berhasil", accessToken});
  } catch (error) {
    res.status(404).json({msg: "Akun tidak ditemukan"});
  }
};
