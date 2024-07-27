import {
  getUserInfoToken,
  invoiceGenerator,
  permissionAccess,
  recordActivity,
} from "../Configuration/supportFunction.js";
import { Op } from "sequelize";
import { invoiceOut } from "../Models/invoiceOut.js";
import moment from "moment";

export const postInvoiceOut = async (req, res) => {
  try {
    const { nama, uang_keluar, note } = req.body;
    const token = req.headers.authorization.replace("Bearer ", "");
    const isNotAccess = await permissionAccess({
      token,
      permission: "transaksi_keluar",
    });
    const { namaStaff } = getUserInfoToken(token) || {};
    if (isNotAccess)
      return res
        .status(400)
        .json({ msg: "Akses Ditolak, Anda tidak memiliki akses!" });

    const totalInvoice = await invoiceOut.count({
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("day").format("YYYY-MM-DD H:mm:ss"),
            moment().endOf("day").format("YYYY-MM-DD H:mm:ss"),
          ],
        },
      },
    });

    const body = {
      nama,
      note,
      uang_keluar,
      petugas: namaStaff,
      invoice_pengeluaran: `OUT-${invoiceGenerator(totalInvoice + 1)}`,
    };
    const data = await invoiceOut.create(body);
    recordActivity({
      action: "Transaksi keluar",
      author: getUserInfoToken(
        req.headers.authorization.replace("Bearer ", "")
      ),
      data,
    });
    res.status(201).json({ msg: "Transaksi berhasil", data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
export const getAllInvoiceOut = async (req, res) => {
  const isNotAccess = await permissionAccess({
    token: req.headers.authorization.replace("Bearer ", ""),
    permission: "laporan_transaksi_keluar",
  });
  if (isNotAccess)
    return res
      .status(403)
      .json({ msg: "Akses Ditolak, Anda tidak memiliki akses!" });

  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 40;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const offside = limit * page;
    const totalData = await invoiceOut.count();
    /// https://stackoverflow.com/a/43127894/18038473
    const whereCondition = Boolean(endDate)
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
    const totalRow = await invoiceOut.count({
      where: {
        ...whereCondition,
      },
      limit: limit,
      offset: offside,
      /// https://stackoverflow.com/a/33145634/18038473
      order: [["updatedAt", "DESC"]],
    });
    const totalPage = Math.ceil(totalRow / limit);

    const dataInvoice = await invoiceOut.findAll({
      where: {
        ...whereCondition,
      },
      limit: limit,
      offset: offside,
      /// https://stackoverflow.com/a/33145634/18038473
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({
      data: dataInvoice,
      totalRows: totalRow,
      totalPage: totalPage,
      limit: limit,
      page: page + 1,
      totalData,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Internal server error" });
  }
};
