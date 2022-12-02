import { tagihan } from "../Models/tagihan.js";
import { jurusan } from "../Models/jurusan.js";
import jwt from "jsonwebtoken";

export const getTagihan = async (req, res) => {
  try {
    const response = await tagihan.findAll({
      include: { model: jurusan },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getTagihanBySiswa = async (req, res) => {
  const kode_tagihan = jwt.decode(
    req.headers.authorization.replace("Bearer ", "")
  );
  try {
    const response = await tagihan.findAll({
      include: { model: jurusan },
      where: {
        kode_tagihan: kode_tagihan.kode_tagihan,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const postTagihan = async (req, res) => {
  const { nama, deskripsi, angkatan, total, periode, jurusanId, kelas } =
    req.body;
  // const jsonPeriode = JSON.parse(periode);
  try {
    const findJurusan = await jurusan.findOne({
      where: {
        id: jurusanId,
      },
    });
    await tagihan.create({
      nama: nama,
      deskripsi: deskripsi,
      angkatan: angkatan,
      total: total,
      jurusanId: jurusanId,
      periode: periode,
      kelas: kelas,
      kode_tagihan: `${angkatan}${findJurusan.nama}${kelas}`,
    });
    console.log(periode, "===");
    res.status(201).json({ msg: "Tagihan berhasil dibuat." });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTagihan = async (req, res) => {
  try {
    await tagihan.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json({ msg: "Tagihan berhasil dihapus." });
  } catch (error) {
    console.log(error);
  }
};

export const updateTagihan = async (req, res) => {
  try {
    const response = await tagihan.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (response[0] === 0)
      return res.status(404).json({ msg: "id tidak ditemukan" });
    res.status(201).json({ msg: "Tagihan berhasil update." });
  } catch (error) {
    console.log(error);
  }
};
