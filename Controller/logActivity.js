import { logActivity } from "../Models/logActivity.js";
import moment from "moment";
import { Op } from "sequelize";
import { getUserInfoToken } from "../Configuration/supportFunction.js";

export const getActivity = async (req, res) => {
  const { roleStaff } =
    getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
  if (roleStaff !== "DEV")
    return res
      .status(403)
      .json({ msg: "Akses Ditolak, Anda tidak memiliki akses!" });
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
              moment(startDate).startOf("day").format("YYYY-MM-DD H:mm:ss"),
              moment(endDate).endOf("day").format("YYYY-MM-DD H:mm:ss"),
            ],
          },
        }
      : {};
    const totalRows = await logActivity.count({ where: { ...whereCondition } });
    const totalData = await logActivity.count();
    const totalPage = Math.ceil(totalRows / limit);
    const logList = await logActivity.findAll({
      where: { ...whereCondition },
      raw: true,
      limit,
      offset: offside,
      order: [["createdAt", "DESC"]],
    });
    const response = {
      data: logList.map((item) => ({
        ...item,
        author: JSON.parse(item.author),
        data: JSON.parse(item.data),
      })),
      totalPage,
      page: page + 1,
      limit,
      totalRows,
      totalData,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
