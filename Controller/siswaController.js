import {siswaAuth} from "../Models/siswa.js";
import {jurusan} from "../Models/jurusan.js";
import jwt from "jsonwebtoken";
import {Op} from "sequelize";
import exeljs from "exceljs";
import fs from "fs/promises";
import {tagihanFix} from "../Models/tagihanFix.js";
import {
  getUserInfoToken,
  isEmptyString,
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
      .json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
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
      include: [{model: jurusan}],
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
    res.status(500).json({msg: error?.message});
  }
};
export const getSiswaById = async (req, res) => {
  try {
    const response = await siswaAuth.findOne({
      include: [{model: jurusan}],
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

const findDuplicateUsername = (listSiswa, username) => {
  let result = false;
  for (let index = 0; index < listSiswa.length; index++) {
    const element = listSiswa[index];
    if (String(element?.username) === String(username)) {
      result = element?.username;
      break;
    }
  }
  return result;
};
const findDuplicateKodeSiswa = (listSiswa, kode_siswa) => {
  let result = false;
  for (let index = 0; index < listSiswa.length; index++) {
    const element = listSiswa[index];
    if (String(element?.kode_siswa) === String(kode_siswa)) {
      result = element?.kode_siswa;
      break;
    }
  }
  return result;
};

const isOnlyWhiteSpace = (text) => {
  return (
    isEmptyString(text) && String(text) !== "" && typeof text !== "undefined"
  );
};

export const importAccount = async (req, res) => {
  try {
    if (
      !Boolean(req.body?.tahun_angkatan) ||
      req.body?.tahun_angkatan === "undefined" ||
      req.body?.tahun_angkatan === "null"
    ) {
      fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
        throw error;
      });
      return res.status(404).json({
        code: "error_validation",
        message: ["Siswa untuk angkatan tidak boleh kosong"],
      });
    }
    const tahun_angkatan = Number(req.body?.tahun_angkatan);
    if (String(tahun_angkatan) === "NaN") {
      fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
        throw error;
      });
      return res.status(404).json({
        code: "error_validation",
        message: ["Invalid tahun angkatan"],
      });
    }

    const listSiswa = await siswaAuth.findAll({raw: true});
    const listJurusan = await jurusan.findAll({raw: true});
    const response = await tagihanFix.findAll({
      raw: true,
      where: {
        tahun_angkatan,
      },
      attributes: {
        exclude: ["tahun_angkatan", "createdAt", "updatedAt", "id"],
      },
    });
    const total = Object.values(response[0] || {}).reduce((a, b) => a + b, 0);

    /// https://github.com/exceljs/exceljs/issues/960#issuecomment-1698549072
    let errorValidation = [];
    let duplicateName = {};
    let duplicateKodeSiswaFromFile = {};
    let duplicateUsernameFromFile = {};
    let injectDataToDB = [];
    const sub_kelas_option = {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
    };
    const kelas_option = {10: true, 11: true, 12: true};
    const gender_option = {P: true, L: true};
    const {Workbook} = exeljs;
    const wb = new Workbook();
    let isEmptyData = false;
    let isBreakFromValidate = false;

    await wb.xlsx.readFile("./Assets/upload/" + req.file.filename).then(() => {
      const workSheet = wb.getWorksheet();
      const totalRow = workSheet.actualRowCount;
      const header = [
        "Nama",
        "Username",
        "Password",
        "Jurusan",
        "Sub kelas",
        "Kelas",
        "Kode siswa",
        "Nomor HP",
        "Alamat siswa",
        "Nama ayah siswa",
        "Nama ibu siswa",
        "Jenis kelamin siswa",
      ];
      if (header.length !== workSheet.getRow(1).values.length - 1) {
        errorValidation.push(`Invalid jumlah header`);
        isBreakFromValidate = true;
      }

      for (
        let clientHeader = 1;
        clientHeader < workSheet.getRow(1).values.length;
        clientHeader++
      ) {
        const clientElement = workSheet.getRow(1).values[clientHeader];
        const isInvalidHeaderName = header.find(
          (item) => item === clientElement
        );
        if (!isInvalidHeaderName) {
          errorValidation.push(
            `Nama header ${clientElement} tidak valid. silahkan download template.`
          );
          isBreakFromValidate = true;
        }
      }

      if (totalRow === 1) {
        isEmptyData = true;
        isBreakFromValidate = true;
      }
      if (isBreakFromValidate) {
        return;
      }
      for (let rowIndex = 2; rowIndex < totalRow + 1; rowIndex += 1) {
        const name = workSheet.getRow(rowIndex).values[1];
        const username = workSheet.getRow(rowIndex).values[2];
        const password = workSheet.getRow(rowIndex).values[3];
        const jurusan = workSheet.getRow(rowIndex).values[4];
        const sub_kelas = workSheet.getRow(rowIndex).values[5];
        const kelas = workSheet.getRow(rowIndex).values[6];
        const kode_siswa = workSheet.getRow(rowIndex).values[7];
        const noHP = workSheet.getRow(rowIndex).values[8];
        const addressSiswa = workSheet.getRow(rowIndex).values[9];
        const fatherName = workSheet.getRow(rowIndex).values[10];
        const motherName = workSheet.getRow(rowIndex).values[11];
        const gender = workSheet.getRow(rowIndex).values[12];

        if (duplicateName[`${name}_${kelas}_${sub_kelas}`]) {
          errorValidation.push(
            `Terdapat nama yang duplikat berdasarkan kelas dan sub kelas. periksa ${name} apakah ada yang sama`
          );
        }
        if (duplicateKodeSiswaFromFile[kode_siswa]) {
          errorValidation.push(
            `Terdapat kode siswa yang duplikat. periksa ${kode_siswa} apakah ada yang sama`
          );
        }
        if (duplicateUsernameFromFile[username]) {
          errorValidation.push(
            `Terdapat username yang duplikat. periksa ${username} apakah ada yang sama`
          );
        }
        duplicateName[`${name}_${kelas}_${sub_kelas}`] = true;
        duplicateKodeSiswaFromFile[kode_siswa] = true;
        duplicateUsernameFromFile[username] = true;
        /// CELL MANDATORY
        if (
          isEmptyString(name) ||
          isEmptyString(username) ||
          isEmptyString(password) ||
          isEmptyString(jurusan) ||
          isEmptyString(sub_kelas) ||
          isEmptyString(kelas) ||
          isEmptyString(kode_siswa)
        ) {
          errorValidation.push(`Kolom yang memiliki warna merah wajib diisi`);
        }
        /// VALIDATION TO MANY WHITE SPACE
        if (
          isOnlyWhiteSpace(noHP) ||
          isOnlyWhiteSpace(addressSiswa) ||
          isOnlyWhiteSpace(fatherName) ||
          isOnlyWhiteSpace(motherName) ||
          isOnlyWhiteSpace(gender)
        ) {
          errorValidation.push(
            `Kolom yang memiliki warna hijau tidak boleh hanya berisi spasi, kosongkan jika tidak ingin mengisi.`
          );
        }
        /// SUB KELAS VALIDATION
        if (!sub_kelas_option[sub_kelas]) {
          errorValidation.push(
            `Baris ${rowIndex} kolom sub kelas tidak valid, pilih antara 1 - 6`
          );
        }
        /// KELAS VALIDATION
        if (!kelas_option[kelas]) {
          errorValidation.push(
            `Baris ${rowIndex} kolom kelas tidak valid, pilih antara 10 - 12`
          );
        }
        /// MAJOR VALIDATION
        const matchMajor = listJurusan.find(
          (item) => item?.kode_jurusan === jurusan
        );
        if (!matchMajor) {
          errorValidation.push(
            `Baris ${rowIndex} kolom jurusan tidak valid, pilih sesuai option yang ada. (${listJurusan
              ?.map((item) => item?.kode_jurusan)
              ?.join(", ")})`
          );
        }
        /// DUPLICATE USERNAME
        const duplicateUsername = findDuplicateUsername(listSiswa, username);
        if (duplicateUsername) {
          errorValidation.push(
            `Baris ${rowIndex} username sudah terdaftar, gunakan yang lain.`
          );
        }
        /// DUPLICATE KODESISWA
        const duplicateKodeSiswa = findDuplicateKodeSiswa(
          listSiswa,
          kode_siswa
        );
        if (duplicateKodeSiswa) {
          errorValidation.push(
            `Baris ${rowIndex} kode siswa sudah terdaftar, gunakan yang lain.`
          );
        }
        /// GENDER VALIDATION
        if (gender && !gender_option[gender]) {
          errorValidation.push(
            `Baris ${rowIndex}, pilihan jenis kelamin hanya P (Perempuan), L (Laki Laki)`
          );
        }
        /// PHONE VALIDATION
        if (
          (noHP && String(noHP)?.length > 12) ||
          (noHP && String(noHP)?.length < 8)
        ) {
          errorValidation.push(
            `Baris ${rowIndex}, No HP tidak valid, max digit 12 min digit 8`
          );
        }
        if (String(Number(noHP)) === "NaN" && !isEmptyString(noHP)) {
          errorValidation.push(
            `Baris ${rowIndex}, No HP tidak valid. Nomor hp harus berupa angka`
          );
        }
        injectDataToDB.push({
          nama: name,
          username,
          password,
          jurusanId: matchMajor?.id,
          sub_kelas,
          kelas,
          kode_siswa,
          noHP,
          alamat: addressSiswa,
          nama_ayah: fatherName,
          nama_ibu: motherName,
          gender,
          current_bill: total,
          status_bill: "not_paid_yet",
          angkatan: tahun_angkatan,
          status: "accepted",
        });
      }
    });
    if (isEmptyData) {
      fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
        throw error;
      });
      return res.status(406).json({
        code: "error_validation",
        message: ["File tidak boleh kosong! setidaknya masukan 1 baris data!"],
      });
    }
    if (Boolean(errorValidation.length)) {
      fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
        throw error;
      });
      return res
        .status(406)
        .json({code: "error_validation", message: errorValidation});
    }
    duplicateName = {};
    duplicateUsernameFromFile = {};
    duplicateKodeSiswaFromFile = {};
    await siswaAuth.bulkCreate(injectDataToDB).then(() => {
      fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
        throw error;
      });
    });
    recordActivity({
      action: `Import siswa, ${injectDataToDB.length} siswa ditambahkan`,
      author: getUserInfoToken(
        req.headers.authorization.replace("Bearer ", "")
      ),
      data: [],
    });
    injectDataToDB = [];
    return res.status(200).json({message: "Berhasil mengimport siswa"});
  } catch (error) {
    console.log(error);
    fs.unlink("./Assets/upload/" + req.file.filename, (error) => {
      console.log(error);
    });
    return res.status(406).json({
      message:
        "Internal server error periksa file anda dan pastikan list username dan kode siswa harus uniq/berbeda",
      code: "server",
    });
  }
};

export const getSiswaProfile = async (req, res) => {
  try {
    const {idSiswa, username} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    const response = await siswaAuth.findOne({
      attributes: {exclude: ["password", "username"]},
      include: [{model: jurusan}],
      where: {
        id: idSiswa,
      },
    });
    const toStringify = JSON.stringify(response);
    const toParse = JSON.parse(toStringify);
    res.json({...toParse, username});
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const siswaRegister = async (req, res) => {
  try {
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
      return res.status(403).json({msg: "Form tidak boleh ada yang kosong"});
    if (
      (noHP && String(noHP)?.length >= 12) ||
      (noHP && String(noHP)?.length <= 8)
    )
      return res
        .status(403)
        .json({msg: "No HP tidak valid, max digit 12 min digit 8"});

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
    res.status(201).json({msg: "Pendaftaran berhasil"});
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: error?.message});
    if (error.name.includes("SequelizeUniqueConstraintError"))
      return res.status(403).json({msg: "Username sudah terdaftar"});
  }
};

export const siswaLogin = async (req, res) => {
  try {
    const findSiswa = await siswaAuth.findOne({
      where: {
        username: req.body.username,
      },
      raw: true,
    });
    if (findSiswa.password !== req.body.password)
      return res.status(400).json({msg: "Periksa password anda"});

    const idSiswa = findSiswa.id;
    const namaSiswa = findSiswa.name;
    const username = findSiswa.username;
    const angkatan = findSiswa.angkatan;
    const kelas = findSiswa.kelas;
    const sub_kelas = findSiswa.sub_kelas;
    const jurusanId = findSiswa.jurusanId;
    const kode_siswa = findSiswa.kode_siswa;
    const accessToken = jwt.sign(
      {
        idSiswa,
        namaSiswa,
        username,
        angkatan,
        kelas,
        sub_kelas,
        jurusanId,
        kode_siswa,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "7d",
      }
    );
    res.json({msg: "Login berhasil", accessToken});
  } catch (error) {
    res.status(404).json({msg: "Akun tidak ditemukan!"});
  }
};

export const siswaUpdate = async (req, res) => {
  try {
    const {noHP} = req.body;
    if (
      (noHP && String(noHP)?.length > 12) ||
      (noHP && String(noHP)?.length < 8)
    ) {
      return res
        .status(404)
        .json({msg: "No HP tidak valid, max digit 12 min digit 8"});
    }
    if (String(Number(noHP)) === "NaN" && !isEmptyString(noHP)) {
      errorValidation.push(
        `Baris ${rowIndex}, No HP tidak valid. Nomor hp harus berupa angka`
      );
    }
    await siswaAuth.update(req.body, {
      where: {
        id: req.params.id,
      },
      fields: "",
      returning: true,
    });
    const {roleStaff} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    if (roleStaff === "ADMINISTRASI") {
      recordActivity({
        action: `Mengupdate siswa`,
        author: getUserInfoToken(
          req.headers.authorization.replace("Bearer ", "")
        ),
        data: req.body,
      });
    }
    res.status(200).json({msg: "Siswa berhasil diupdate"});
  } catch (error) {
    res.status(500).json({msg: error?.message});
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
        .json({msg: "Update Error", message: listErrorInject});

    recordActivity({
      action: `Mengubah status kelas siswa secara masal`,
      author: getUserInfoToken(
        req.headers.authorization.replace("Bearer ", "")
      ),
      data: [],
    });
    res.status(200).json({
      msg: `${req.body.users.length} Siswa berhasil diupdate`,
      message: req.body.users,
    });
  } catch (error) {
    res.status(500).json({msg: "Server Error", reason: error});
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
        .json({msg: "Update Error", message: listErrorInject});

    recordActivity({
      action: `Mengubah status siswa secara masal`,
      author: getUserInfoToken(
        req.headers.authorization.replace("Bearer ", "")
      ),
      data: [],
    });
    res.status(200).json({
      msg: `${req.body.users.length} Siswa berhasil diupdate`,
      message: req.body.users,
    });
  } catch (error) {
    res.status(500).json({msg: "Server Error", reason: error});
  }
};
