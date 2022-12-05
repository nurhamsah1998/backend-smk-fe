import { siswaAuth } from "../Models/siswa.js";
import bcrypt from "bcrypt";
import { jurusan } from "../Models/jurusan.js";
import jwt from "jsonwebtoken";
import { uid } from "uid";
import { Op } from "sequelize";

export const getSiswa = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offside = limit * page;
  const totalRows = await siswaAuth.count({
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
        {
          kode_siswa: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });

  const totalPage = Math.ceil(totalRows / limit);
  const data = await siswaAuth.findAll({
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
  try {
    const response = {
      data: data,
      totalPage: totalPage,
      limit: limit,
      totalRows: totalRows,
      page: page,
    };
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};
export const getSiswaByCode = async (req, res) => {
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
  const { nama, username, password, noHP, jurusanId, kelas, kode_siswa } =
    req.body;
  if (username === "" || password === "")
    return res.status(403).json({ msg: "Form tidak boleh ada yang kosong" });
  // const salt = await bcrypt.genSalt();
  // const securePassword = await bcrypt.hash(password, salt);
  // const EncryptNISN = CryptoJS.AES.encrypt(
  //   username,
  //   process.env.SECRET_ENCRYPT
  // ).toString();
  try {
    // const NISN = await siswaAuth.findAll({
    //   attributes: ["username"],
    // });
    // const toStringify = JSON.stringify(NISN);
    // const toArray = JSON.parse(toStringify);
    // const decrypt = toArray.map((i) => {
    //   const DecryptNISN = CryptoJS.AES.decrypt(
    //     i.username,
    //     process.env.SECRET_ENCRYPT
    //   );
    //   const originalText = DecryptNISN.toString(CryptoJS.enc.Utf8);
    //   return { username: originalText };
    // });
    // const isNisinHasRegister = decrypt.find((i) => i.username === req.body.username);
    // if (isNisinHasRegister)
    //   return res.status(400).json({ msg: "NISN telah terdaftar" });
    const findJurusan = await jurusan.findOne({
      where: {
        id: jurusanId,
      },
    });
    const length = await siswaAuth.findAndCountAll();
    await siswaAuth.create({
      nama: nama,
      username: username,
      password: password,
      noHP: noHP,
      angkatan: new Date().getFullYear(),
      jurusanId: jurusanId,
      kelas: kelas,
      kode_siswa: `${findJurusan.nama}${new Date().getFullYear()}SISWA${
        length.count
      }`,
    });
    res.status(201).json({ msg: "Pendaftaran berhasil" });
  } catch (error) {
    console.log(error);
    if (error.name.includes("SequelizeUniqueConstraintError"))
      return res.status(403).json({ msg: "Username sudah terdaftar" });
  }
};

export const siswaLogin = async (req, res) => {
  try {
    // const NISN = await siswaAuth.findAll();
    // const toStringify = JSON.stringify(NISN);
    // const toArray = JSON.parse(toStringify);
    // const decrypt = toArray.map((i) => {
    //   const DecryptNISN = CryptoJS.AES.decrypt(
    //     i.username,
    //     process.env.SECRET_ENCRYPT
    //   );
    //   const originalText = DecryptNISN.toString(CryptoJS.enc.Utf8);
    //   return { ...i, username: originalText };
    // });
    // const isNisinHasRegister = decrypt.find((i) => i.username === req.body.username);
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
        username: req.body.username,
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
    const angkatan = findSiswa[0].angkatan;
    const kelas = findSiswa[0].kelas;
    const namaJurusan = findJurusan.nama;
    const kode_tagihan = `${angkatan}${namaJurusan}${kelas}`;
    const accessToken = jwt.sign(
      {
        idSiswa,
        kode_tagihan,
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
  await siswaAuth.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ msg: "update success" });
};
