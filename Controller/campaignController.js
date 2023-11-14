import { getUserInfoToken } from "../Configuration/supportFunction.js";
import { campaign } from "../Models/campaign.js";
import { jurusan } from "../Models/jurusan.js";

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
      return res.status(406).json({ msg: "Maksimal 5 pengumuman" });
    await campaign.create({
      text,
      status,
      kelas,
      title,
      staff_id: staffProfile.idStaff,
      sub_kelas,
      jurusan_id,
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
      include: [{ model: jurusan }],
    });
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
export const deleteCampaign = async (req, res) => {
  try {
    await campaign.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Berhasil menghapus pengumuman" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
