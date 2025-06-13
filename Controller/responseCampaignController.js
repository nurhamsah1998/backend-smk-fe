import {
  getUserInfoToken,
  recordActivity,
} from "../Configuration/supportFunction.js";
import {campaign} from "../Models/campaign.js";
import {jurusan} from "../Models/jurusan.js";
import {responseCampaign} from "../Models/responseCampaign.js";
import {siswaAuth} from "../Models/siswa.js";

export const postResponseCampaign = async (req, res) => {
  const {text, campaign_id} = req.body;
  try {
    const responseProfile = getUserInfoToken(
      req.headers.authorization.replace("Bearer ", "")
    );
    const isAlreadyResponse = await campaign.findOne({
      where: {
        id: campaign_id,
      },
      /// Sequelize: Include.where filtering by a 'parent' Model attribute
      /// https://stackoverflow.com/a/36391912/18038473
      include: {
        model: responseCampaign,
        where: {
          siswa_id: responseProfile?.idSiswa,
        },
      },
    });
    if (isAlreadyResponse)
      return res
        .status(406)
        .json({msg: "Tidak dapat mengirim respon, max 1 respon"});
    await responseCampaign.create({
      text,
      siswa_id: responseProfile.idSiswa,
      campaign_id,
    });
    res.status(201).json({msg: "Respon terkirim"});
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: "Internal server error"});
  }
};
// export const patchResponseCampaign = async (req, res) => {
//   const { text, campaign_id } = req.body;
//   try {
//     await campaign.update(
//       {
//         text,
//         campaign_id,
//       },
//       {
//         where: {
//           id: req.params.id,
//         },
//       }
//     );
//     res.status(201).json({ msg: "Berhasil mengubah pengumuman" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ msg: "Internal server error" });
//   }
// };
export const getResponseCampaign = async (req, res) => {
  try {
    const data = await responseCampaign.findAll({
      where: {
        campaign_id: req.query.campaign_id,
      },

      include: [
        {
          model: siswaAuth,
          include: [
            {
              model: jurusan,
            },
          ],
        },
      ],
    });
    res.status(200).json({data});
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: "Internal server error"});
  }
};
export const deleteResponseCampaign = async (req, res) => {
  try {
    const findResponseCampaign = await responseCampaign.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!findResponseCampaign) {
      return res.status(404).json({msg: "Gagal menghapus respon pengumuman"});
    }

    await responseCampaign.destroy({
      where: {
        id: findResponseCampaign.id,
      },
    });

    recordActivity({
      action: `Menghapus respon pengumuman`,
      author: getUserInfoToken(
        req.headers.authorization.replace("Bearer ", "")
      ),
      data: findResponseCampaign,
    });
    res.status(200).json({msg: "Berhasil menghapus respon pengumuman"});
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: "Internal server error"});
  }
};
