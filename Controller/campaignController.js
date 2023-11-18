import { Op } from "sequelize";
import { getUserInfoToken } from "../Configuration/supportFunction.js";
import { campaign } from "../Models/campaign.js";
import { jurusan } from "../Models/jurusan.js";
import { responseCampaign } from "../Models/responseCampaign.js";
import { stafAuth } from "../Models/staf.js";
import { siswaAuth } from "../Models/siswa.js";

export const postCampaign = async (req, res) => {
  const {
    text,
    status,
    kelas,
    sub_kelas,
    jurusan_id,
    angkatan,
    title,
    is_response,
  } = req.body;

  try {
    const staffProfile = getUserInfoToken(
      req.headers.authorization.replace("Bearer ", "")
    );
    const totalCampaign = await campaign.count({
      where: {
        staff_id: staffProfile.idStaff,
      },
    });
    if (totalCampaign === 5)
      return res.status(406).json({
        msg: "Gagal membuat. Setiap user admin hanya boleh membuat 5 pengumuman saja",
      });
    await campaign.create({
      text,
      status,
      kelas,
      title,
      staff_id: staffProfile.idStaff,
      sub_kelas,
      jurusan_id: Boolean(jurusan_id) ? jurusan_id : null,
      angkatan,
      is_response,
    });
    res.status(201).json({ msg: "Berhasil membuat pengumuman" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
export const patchCampaign = async (req, res) => {
  const {
    text,
    status,
    kelas,
    sub_kelas,
    jurusan_id,
    angkatan,
    title,
    is_response,
  } = req.body;
  try {
    await campaign.update(
      {
        text,
        status,
        kelas,
        title,
        sub_kelas,
        jurusan_id,
        angkatan,
        is_response,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(201).json({ msg: "Berhasil mengubah pengumuman" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
export const getAllCampaign = async (req, res) => {
  const staffProfile = getUserInfoToken(
    req.headers.authorization.replace("Bearer ", "")
  );
  try {
    const data = await campaign.findAll({
      where: {
        staff_id: staffProfile.idStaff,
      },
      attributes: { exclude: ["staff_id"] },
      include: [
        { model: jurusan },
        {
          model: responseCampaign,
          include: { model: siswaAuth, include: [{ model: jurusan }] },
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
export const getCampaign = async (req, res) => {
  try {
    const data = await campaign.findAll({
      where: {
        angkatan: {
          [Op.like]: req.query.angkatan || "%",
        },
      },

      include: [
        {
          model: jurusan,
        },
        {
          model: responseCampaign,
          include: [
            {
              model: siswaAuth,
              include: [{ model: jurusan }],
            },
          ],
        },
        {
          model: stafAuth,
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
export const deleteCampaign = async (req, res) => {
  try {
    const findCampaign = await campaign.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!findCampaign) {
      return res.status(404).json({ msg: "Gagal menghapus pengumuman" });
    }

    await campaign.destroy({
      where: {
        id: findCampaign.id,
      },
    });
    res.status(200).json({ msg: "Berhasil menghapus pengumuman" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
