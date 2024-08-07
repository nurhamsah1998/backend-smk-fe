import { siswaAuth } from "../Models/siswa.js";
import { jurusan } from "../Models/jurusan.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import exeljs from "exceljs";
import fs from "fs/promises";
import { tagihanFix } from "../Models/tagihanFix.js";
import {
  getUserInfoToken,
  permissionAccess,
  recordActivity,
} from "../Configuration/supportFunction.js";

export const getSiswa = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 40;
  const search = req.query.search || "";
  const type = req.query.type || "not_access";
  const angkatan = req.query.angkatan || "%";
  const currentBill = req.query.current_bill || "";
  const jurusanId = req.query.jurusanId || "%";
  const kelas = req.query.kelas || "%";
  const subKelas = req.query.sub_kelas || "%";
  const status = req.query.status || "%";
  const offside = limit * page;
  const isNotAccess = await permissionAccess({
    token: req.headers.authorization.replace("Bearer ", ""),
    permission: type,
  });
  if (isNotAccess)
    return res
      .status(403)
      .json({ msg: "Akses Ditolak, Anda tidak memiliki akses!" });
  try {
    const totalData = await siswaAuth.count();
    const totalRows = await siswaAuth.count({
      where: {
        current_bill: {
          [Op.or]: {
            [currentBill === "not_paid"
              ? Op.gt
              : currentBill === "paid" || currentBill === "not_paid_yet"
              ? Op.eq
              : currentBill === "deposit"
              ? Op.lt
              : Op.gt]: currentBill === "" ? -1 : 0,
            [currentBill === "" ||
            currentBill === "not_paid_yet" ||
            currentBill === "deposit"
              ? Op.lt
              : Op.gt]: 0,
          },
        },
        status_bill: {
          [Op.like]:
            currentBill === "not_paid_yet"
              ? "not_paid_yet"
              : currentBill === "paid"
              ? "paid"
              : "%",
        },
        angkatan: {
          [Op.like]: angkatan,
        },
        jurusanId: {
          [Op.like]: jurusanId,
        },
        kelas: {
          [Op.like]: kelas,
        },
        sub_kelas: {
          [Op.like]: subKelas,
        },
        status: {
          [Op.like]: status,
        },
        [Op.or]: [
          {
            nama: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nama_ayah: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nama_ibu: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            username: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            kode_siswa: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });

    const totalPage = Math.ceil(totalRows / limit);
    let data = await siswaAuth.findAll({
      raw: true,
      where: {
        current_bill: {
          [Op.or]: {
            [currentBill === "not_paid"
              ? Op.gt
              : currentBill === "paid" || currentBill === "not_paid_yet"
              ? Op.eq
              : currentBill === "deposit"
              ? Op.lt
              : Op.gt]: currentBill === "" ? -1 : 0,
            [currentBill === "" ||
            currentBill === "not_paid_yet" ||
            currentBill === "deposit"
              ? Op.lt
              : Op.gt]: 0,
          },
        },
        status_bill: {
          [Op.like]:
            currentBill === "not_paid_yet"
              ? "not_paid_yet"
              : currentBill === "paid"
              ? "paid"
              : "%",
        },
        angkatan: {
          [Op.like]: angkatan,
        },
        jurusanId: {
          [Op.like]: jurusanId,
        },
        kelas: {
          [Op.like]: kelas,
        },
        sub_kelas: {
          [Op.like]: subKelas,
        },
        status: {
          [Op.like]: status,
        },
        [Op.or]: [
          {
            nama: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nama_ayah: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nama_ibu: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            username: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            kode_siswa: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      limit: limit,
      offset: offside,
      order: [["id", "DESC"]],
      include: [{ model: jurusan }],
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
export const getSiswaById = async (req, res) => {
  try {
    const response = await siswaAuth.findOne({
      include: [{ model: jurusan }],
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};
export const importAccount = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const listSiswa = await siswaAuth.findAll({ raw: true });
  const listJurusan = await jurusan.findAll({ raw: true });
  const response = await tagihanFix.findAll({
    raw: true,
    where: {
      tahun_angkatan: currentYear,
    },
    attributes: {
      exclude: ["tahun_angkatan", "createdAt", "updatedAt", "id"],
    },
  });
  const total = Object.values(response[0] || {}).reduce((a, b) => a + b, 0);

  try {
    /// https://github.com/exceljs/exceljs/issues/960#issuecomment-1698549072
    let errorValidation = [];
    let errorInjectUsernameToDB = [];
    let errorInjectJurusanToDB = [];
    let injectDataToDB = [];
    let duplicateSameUserName = [];
    let isNoData = false;
    const { Workbook } = exeljs;
    const wb = new Workbook();
    await wb.xlsx
      .readFile("./Assets/upload/" + req.file.filename)
      .then((res) => {
        const workSheet = wb.getWorksheet();
        const totalColumn = workSheet.actualColumnCount;
        const totalRow = workSheet.actualRowCount;
        if (totalRow === 1) {
          isNoData = true;
        }
        for (
          let indexColumn = 1;
          indexColumn < totalColumn + 1;
          indexColumn++
        ) {
          for (let indexRow = 1; indexRow < totalRow + 1; indexRow++) {
            if (
              workSheet.getColumn(indexColumn).letter === "A" ||
              workSheet.getColumn(indexColumn).letter === "B" ||
              workSheet.getColumn(indexColumn).letter === "C" ||
              workSheet.getColumn(indexColumn).letter === "D" ||
              workSheet.getColumn(indexColumn).letter === "E" ||
              workSheet.getColumn(indexColumn).letter === "F" ||
              workSheet.getColumn(indexColumn).letter === "G"
            ) {
              if (
                workSheet
                  .getColumn(indexColumn)
                  .values.indexOf(
                    workSheet.getColumn(indexColumn).values[indexRow]
                  ) === -1
              ) {
                errorValidation.push({
                  column: indexRow,
                  row: workSheet.getColumn(indexColumn).letter,
                });
              }
            }
            /// VALIDATION USER NAME
            if (workSheet.getColumn(indexColumn).letter === "B") {
              if (indexRow !== 1) {
                duplicateSameUserName.push(
                  workSheet.getColumn(indexColumn).values[indexRow]
                );
              }
              const isAlreadyExistAccount = listSiswa.find(
                (username) =>
                  username.username ===
                  workSheet.getColumn(indexColumn).values[indexRow].toString()
              );
              if (
                isAlreadyExistAccount &&
                Boolean(
                  workSheet.getColumn(indexColumn).values[indexRow] !==
                    "username"
                )
              ) {
                errorInjectUsernameToDB.push({
                  row: workSheet.getColumn(indexColumn).letter,
                  column: indexRow,
                  username: isAlreadyExistAccount.username,
                  reason: "Already exist",
                });
              }
            }
            if (workSheet.getColumn(indexColumn).letter === "D") {
              const jurusanNotValid = listJurusan.find(
                (jurusan) =>
                  jurusan.kode_jurusan ===
                  workSheet
                    .getColumn(indexColumn)
                    .values[indexRow].toUpperCase()
              );
              if (
                !jurusanNotValid &&
                Boolean(
                  workSheet.getColumn(indexColumn).values[indexRow] !==
                    "kode_jurusan"
                )
              ) {
                errorInjectJurusanToDB.push({
                  row: workSheet.getColumn(indexColumn).letter,
                  column: indexRow,
                  kode_jurusan:
                    workSheet.getColumn(indexColumn).values[indexRow],
                  reason: "Jurusan tidak valid",
                });
              }
            }
          }
        }
      });
    /// https://stackoverflow.com/a/49215411/18038473
    let findDuplicate = [
      ...new Set(
        duplicateSameUserName.filter(
          (item, index) => duplicateSameUserName.indexOf(item) !== index
        )
      ),
    ];
    if (Boolean(findDuplicate.length)) {
      res.status(406).json({
        code: "error_validation_no_data",
        message: `Gagal upload file. Username harus unique/berbeda. Username ${findDuplicate.join()} telah banyak digunakan, coba ganti yang lainnya`,
      });
      fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
        console.log(error);
      });
      return;
    }
    if (Boolean(isNoData)) {
      res.status(406).json({
        code: "error_validation_no_data",
        message: "File tidak boleh kosong! setidaknya masukan 1 baris data!",
      });
      fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
        console.log(error);
      });
      return;
    }

    if (Boolean(errorValidation.length)) {
      res
        .status(406)
        .json({ code: "error_validation", message: errorValidation });
      fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
        console.log(error);
      });
      return;
    }
    if (Boolean(errorInjectUsernameToDB.length)) {
      res.status(406).json({
        code: "error_inject_username",
        message: errorInjectUsernameToDB,
      });
      fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
        console.log(error);
      });
      return;
    }
    if (Boolean(errorInjectJurusanToDB.length)) {
      res.status(406).json({
        code: "error_inject_jurusan",
        message: errorInjectJurusanToDB,
      });
      fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
        console.log(error);
      });
      return;
    }

    await wb.xlsx
      .readFile("./Assets/upload/" + req.file.filename)
      .then((res) => {
        const workSheet = wb.getWorksheet();
        const totalRow = workSheet.actualRowCount;
        for (let indexColumn = 1; indexColumn < totalRow + 1; indexColumn++) {
          if (indexColumn !== 1) {
            injectDataToDB.push({
              nama: workSheet.getRow(indexColumn).values[1],
              username: workSheet.getRow(indexColumn).values[2],
              password: workSheet.getRow(indexColumn).values[3],
              jurusanId: listJurusan.find(
                (item) =>
                  item.kode_jurusan ===
                  workSheet.getRow(indexColumn).values[4].toUpperCase()
              ).id,
              sub_kelas:
                workSheet.getRow(indexColumn).values[5].toString() || 1,
              kelas: workSheet.getRow(indexColumn).values[6].toString() || 10,
              kode_siswa: workSheet.getRow(indexColumn).values[7],
              noHP: workSheet.getRow(indexColumn).values[8] || "",
              alamat: workSheet.getRow(indexColumn).values[9] || "",
              nama_ayah: workSheet.getRow(indexColumn).values[10] || "",
              nama_ibu: workSheet.getRow(indexColumn).values[11] || "",
              gender: workSheet.getRow(indexColumn).values[12] || "",
              current_bill: total,
              status_bill: "not_paid_yet",
              angkatan: currentYear,
              status: "accepted",
            });
          }
        }
      });
    await siswaAuth.bulkCreate(injectDataToDB);
    res.status(200).json({ massega: "Berhasil mengimport siswa" });
  } catch (error) {
    console.log(error);
    res.status(406).json({
      message:
        "Internal server error periksa file anda dan pastikan list username dan kode siswa harus uniq/berbeda",
      code: "server",
    });
    fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
      console.log(error);
    });
  }
};

export const getSiswaProfile = async (req, res) => {
  const decodedTokenFromClient = jwt.decode(
    req.headers.authorization.replace("Bearer ", "")
  );
  try {
    const response = await siswaAuth.findOne({
      attributes: { exclude: ["password", "username"] },
      include: [{ model: jurusan }],
      where: {
        id: decodedTokenFromClient.idSiswa,
      },
    });
    const toStringify = JSON.stringify(response);
    const toParse = JSON.parse(toStringify);
    res.json({ ...toParse, username: decodedTokenFromClient.username });
  } catch (error) {
    console.log(error);
  }
};

export const siswaRegister = async (req, res) => {
  const {
    nama,
    username,
    password,
    noHP,
    jurusanId,
    kelas,
    alamat,
    nama_ayah,
    nama_ibu,
    gender,
    status_bill,
    current_bill,
    isAdminCreation,
    angkatan,
  } = req.body;
  if (username === "" || password === "")
    return res.status(403).json({ msg: "Form tidak boleh ada yang kosong" });
  try {
    const length = await siswaAuth.findAndCountAll({
      where: {
        angkatan: angkatan || new Date().getFullYear(),
      },
    });
    const kodeSiswaGenerator = (arg) => {
      const year = angkatan || String(new Date().getFullYear());
      const total = "000".slice(0, 3 - String(arg).length);
      return year + total + String(arg);
    };
    const body = {
      nama: nama,
      alamat: alamat,
      nama_ayah: nama_ayah,
      nama_ibu: nama_ibu,
      username: username,
      password: password,
      noHP: noHP,
      gender,
      angkatan: angkatan || new Date().getFullYear(),
      jurusanId: jurusanId,
      kelas: kelas,
      kode_siswa: kodeSiswaGenerator(length.count + 1),
      status_bill,
      current_bill,
    };
    await siswaAuth.create(body);
    if (isAdminCreation) {
      recordActivity({
        action: "Menambah Siswa Perorangan",
        data: body,
        author: getUserInfoToken(
          req.headers.authorization.replace("Bearer ", "")
        ),
      });
    }
    res.status(201).json({ msg: "Pendaftaran berhasil" });
  } catch (error) {
    console.log(error);
    if (error.name.includes("SequelizeUniqueConstraintError"))
      return res.status(403).json({ msg: "Username sudah terdaftar" });
  }
};

export const siswaLogin = async (req, res) => {
  try {
    const findSiswa = await siswaAuth.findAll({
      where: {
        [Op.or]: [
          {
            username: {
              [Op.like]: req.body.username,
            },
          },
          {
            kode_siswa: {
              [Op.like]: req.body.username,
            },
          },
        ],
      },
    });
    if (!findSiswa[0].password.includes(req.body.password))
      return res.status(400).json({ msg: "Periksa password anda" });

    const findJurusan = await jurusan.findOne({
      where: {
        id: findSiswa[0].jurusanId,
      },
    });
    if (!findJurusan)
      return res
        .status(404)
        .json({ msg: "Error 500. JurusanId tidak ditemukan" });
    const idSiswa = findSiswa[0].id;
    const namaSiswa = findSiswa[0].name;
    const username = findSiswa[0].username;
    const accessToken = jwt.sign(
      {
        idSiswa,
        namaSiswa,
        username,
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
  try {
    await siswaAuth.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Siswa berhasil diupdate" });
  } catch (error) {
    res.status(403).json({ msg: "Internal server error !" });
  }
};
export const bulkStatusKelasSiswa = async (req, res) => {
  let errorInject = false;
  let listErrorInject = [];
  try {
    for (let index = 0; index < req.body.users.length; index++) {
      const updateSIswa = await siswaAuth.update(
        {
          kelas: req.body.newKelas,
          jurusanId: req.body.newJurusanId,
          sub_kelas: req.body.newSubKelas,
        },
        {
          where: {
            id: req.body.users[index].id,
          },
        }
      );
      if (!Boolean(updateSIswa[0])) {
        errorInject = true;
        listErrorInject.push(req.body.users[index]);
      }
    }
    if (Boolean(errorInject))
      return res
        .status(406)
        .json({ msg: "Update Error", message: listErrorInject });
    res.status(200).json({
      msg: `${req.body.users.length} Siswa berhasil diupdate`,
      message: req.body.users,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", reason: error });
  }
};
export const bulkStatusSiswaUpdate = async (req, res) => {
  let errorInject = false;
  let listErrorInject = [];
  try {
    for (let index = 0; index < req.body.users.length; index++) {
      const updateSIswa = await siswaAuth.update(
        {
          status: req.body.status,
        },
        {
          where: {
            id: req.body.users[index].id,
          },
        }
      );
      if (!Boolean(updateSIswa[0])) {
        errorInject = true;
        listErrorInject.push(req.body.users[index]);
      }
    }
    if (Boolean(errorInject))
      return res
        .status(406)
        .json({ msg: "Update Error", message: listErrorInject });
    res.status(200).json({
      msg: `${req.body.users.length} Siswa berhasil diupdate`,
      message: req.body.users,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", reason: error });
  }
};
