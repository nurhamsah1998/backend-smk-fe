import { jurusan } from "../Models/jurusan.js";

export const getJurusan = async (req, res) => {
  try {
    const response = await jurusan.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const postJurusan = async (req, res) => {
  try {
    await jurusan.create({
      nama: req.body.nama,
    });
    res.status(201).json({ msg: "Jurusan berhasil dibuat." });
  } catch (error) {
    console.log(error);
  }
};

export const deleteJurusan = async (req, res) => {
  try {
    const response = await jurusan.destroy({
      where: {
        id: req.params.id,
      },
    });
    console.log(response);
    if (response === 0)
      return res.status(404).json({ msg: "id tidak ditemukan" });
    res.status(201).json({ msg: "Jurusan berhasil dihapus." });
  } catch (error) {
    console.log(error);
  }
};

export const updateJurusan = async (req, res) => {
  try {
    const response = await jurusan.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (response[0] === 0)
      return res.status(404).json({ msg: "id tidak ditemukan" });
    res.status(201).json({ msg: "Jurusan berhasil update." });
  } catch (error) {
    console.log(error);
  }
};
