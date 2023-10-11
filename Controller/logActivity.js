import { logActivity } from "../Models/logActivity.js";

export const getActivity = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 10;
  const offside = limit * page;
  try {
    const totalRows = await logActivity.count();
    const totalPage = Math.ceil(totalRows / limit);
    const logList = await logActivity.findAll({
      raw: true,
      limit,
      offset: offside,
      order: [["createdAt", "ASC"]],
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
      totalData: totalRows,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
