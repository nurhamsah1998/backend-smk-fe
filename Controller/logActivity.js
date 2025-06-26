import {logActivity} from "../Models/logActivity.js";
import moment from "moment";
import {Op} from "sequelize";
import {getUserInfoToken} from "../Configuration/supportFunction.js";
import {stafAuth} from "../Models/staf.js";

export const getActivity = async (req, res) => {
  const {roleStaff} =
    getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
  if (roleStaff !== "DEV")
    return res
      .status(403)
      .json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 10;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const offside = limit * page;
  try {
    /// https://stackoverflow.com/a/43127894/18038473
    const whereCondition = Boolean(endDate !== "null")
      ? {
          createdAt: {
            [Op.between]: [
              /// https://stackoverflow.com/a/12970385/18038473
              moment(startDate).startOf("day").toISOString(),
              moment(endDate).endOf("day").toISOString(),
            ],
          },
        }
      : {};
    const totalRows = await logActivity.count({where: {...whereCondition}});
    const totalData = await logActivity.count();
    const totalPage = Math.ceil(totalRows / limit);
    const logList = await logActivity.findAll({
      where: {...whereCondition},
      raw: true,
      nest: true,
      limit,
      offset: offside,
      include: {model: stafAuth, attributes: ["nama", "username"]},
      order: [["createdAt", "DESC"]],
    });
    const response = {
      data: logList.map((item) => ({
        ...item,
        author_name: item?.staf.nama || "-",
        author_username: item?.staf.username || "-",
        data: item?.data ? JSON.parse(item?.data) : [],
      })),
      totalPage,
      page: page + 1,
      limit,
      totalRows,
      totalData,
    };
    res.status(200).json(response);
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};
export const clearActivity = async (req, res) => {
  const {roleStaff} =
    getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
  if (roleStaff !== "DEV")
    return res
      .status(403)
      .json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
  try {
    await logActivity.destroy({
      where: {
        id: {
          [Op.not]: null,
        },
      },
    });
    res.status(200).json({msg: "Berhasil menghapus log aktivitas"});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};
