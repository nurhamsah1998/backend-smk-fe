import { tagihan } from "../Models/tagihan.js";
import { jurusan } from "../Models/jurusan.js";

export const getTagihan = async (req, res) => {
  try {
    const response = await tagihan.findAll({
      include: [{ model: jurusan }],
    });
    if (response.length <= 0) return res.json({ msg: "Tidak ada data yang ditampilkan." });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const postTagihan = async (req, res) => {
  const { nama, deskripsi, angkatan, total, jurusanId } = req.body;
  try {
    await tagihan.create({
      nama: nama,
      deskripsi: deskripsi,
      angkatan: angkatan,
      total: total,
      jurusanId: jurusanId,
    });
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
    if (response[0] === 0) return res.status(404).json({ msg: "id tidak ditemukan" });
    res.status(201).json({ msg: "Tagihan berhasil update." });
  } catch (error) {
    console.log(error);
  }
};
