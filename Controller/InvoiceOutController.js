import {
  getUserInfoToken,
  invoiceGenerator,
  permissionAccess,
  recordActivity,
} from "../Configuration/supportFunction.js";
import {Op} from "sequelize";
import {invoiceOut} from "../Models/invoiceOut.js";
import moment from "moment";

export const postInvoiceOut = async (req, res) => {
  try {
    const {nama, uang_keluar, note} = req.body;
    const token = req.headers.authorization.replace("Bearer ", "");
    await permissionAccess({
      req,
      res,
      permission: "transaksi_keluar",
    });
    const {namaStaff} = getUserInfoToken(token) || {};

    const totalInvoice = await invoiceOut.count({
      where: {
        createdAt: {
          [Op.between]: [
            /// https://stackoverflow.com/a/12970385/18038473
            moment().startOf("day").toISOString(),
            moment().endOf("day").toISOString(),
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
      author: getUserInfoToken(req.headers.authorization.replace("Bearer ", ""))
        ?.idStaff,
      data,
    });
    res.status(201).json({msg: "Transaksi berhasil", data: data});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};
export const getAllInvoiceOut = async (req, res) => {
  await permissionAccess({
    req,
    res,
    permission: "laporan_transaksi_keluar",
  });

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
              moment(startDate).startOf("day").toISOString(),
              moment(endDate).endOf("day").toISOString(),
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
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};
