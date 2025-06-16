import {getUserInfoToken} from "../Configuration/supportFunction.js";
import {jurusan} from "../Models/jurusan.js";
import {siswaAuth} from "../Models/siswa.js";

export const getJurusan = async (req, res) => {
  try {
    const response = await jurusan.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const postJurusan = async (req, res) => {
  try {
    const {roleStaff} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    if (roleStaff !== "DEV")
      return res
        .status(403)
        .json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});

    if (req.body.kode_jurusan?.length > 10)
      return res
        .status(400)
        .json({msg: "Kode jurusan terlalu panjang. Max 10 karakter"});
    await jurusan.create({
      nama: req.body.nama,
      kode_jurusan: req.body.kode_jurusan?.toUpperCase(),
    });
    res.status(201).json({msg: "Jurusan berhasil dibuat."});
  } catch (error) {
    return res
      .status(500)
      .json({msg: error?.message || "Internal server error"});
  }
};

export const deleteJurusan = async (req, res) => {
  try {
    const {roleStaff} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    if (roleStaff !== "DEV")
      return res
        .status(403)
        .json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
    const response = await jurusan.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (response === 0)
      return res.status(404).json({msg: "id tidak ditemukan"});
    res.status(201).json({msg: "Jurusan berhasil dihapus."});
  } catch (error) {
    const relatedMajor = await siswaAuth.count({
      where: {
        jurusanId: req.params.id,
      },
    });
    if (relatedMajor) {
      return res.status(404).json({
        msg: `jurusan tidak bisa dihapus, karena sudah terhubung ke siswa. terdapat ${relatedMajor} siswa yang memiliki jurusan ini`,
      });
    } else {
      res.status(500).json({msg: error?.message});
    }
  }
};

export const updateJurusan = async (req, res) => {
  try {
    const {roleStaff} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    if (roleStaff !== "DEV")
      return res
        .status(403)
        .json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
    const {nama, kode_jurusan} = req.body;
    const response = await jurusan.update(
      {nama, kode_jurusan},
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (response[0] === 0)
      return res.status(404).json({msg: "id tidak ditemukan"});
    res.status(201).json({msg: "Jurusan berhasil update."});
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};
