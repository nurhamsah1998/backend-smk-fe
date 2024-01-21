import { invoice } from "../Models/invoice.js";
import { Op } from "sequelize";
import moment from "moment";
import {
  getUserInfoToken,
  permissionAccess,
  recordActivity,
} from "../Configuration/supportFunction.js";

export const postInvoice = async (req, res) => {
  const {
    nama,
    total,
    petugas,
    kode_tagihan,
    kode_pembayaran,
    uang_diterima,
    note,
    kelas,
    jurusan,
    sub_kelas,
    tahun_angkatan,
  } = req.body;
  const hasAccess = await permissionAccess({
    token: req.headers.authorization.replace("Bearer ", ""),
    permission: "transaksi",
  });
  if (hasAccess)
    return res
      .status(400)
      .json({ msg: "Akses Ditolak, Anda tidak memiliki akses!" });
  const date = new Date();
  const totalInvoice = await invoice.count({
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
  const invoiceGenerator = (arg) => {
    const codeTime = `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}`;
    const total = "000".slice(0, 3 - String(arg).length);
    return codeTime + total + String(arg);
  };
  try {
    const body = {
      nama: nama,
      total: total,
      petugas: petugas,
      note: note,
      kode_tagihan: kode_tagihan,
      kode_pembayaran: kode_pembayaran,
      uang_diterima: uang_diterima,
      jurusan,
      sub_kelas,
      kelas,
      tahun_angkatan,
      invoice: invoiceGenerator(totalInvoice + 1),
    };
    const data = await invoice.create(body);
    recordActivity({
      action: "Transaksi",
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

export const getInvoice = async (req, res) => {
  try {
    const responseInvoice = await invoice.findAll({
      where: {
        kode_tagihan: req.query.kode_tagihan,
      },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json(responseInvoice);
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Internal server error" });
  }
};
export const getAllInvoice = async (req, res) => {
  const hasAccess = await permissionAccess({
    token: req.headers.authorization.replace("Bearer ", ""),
    permission: "laporan_transaksi",
  });
  if (hasAccess)
    return res
      .status(403)
      .json({ msg: "Akses Ditolak, Anda tidak memiliki akses!" });
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const offside = limit * page;
    const jurusan = req.query.jurusan || "%";
    const kelas = req.query.kelas || "%";
    const subKelas = req.query.sub_kelas || "%";
    const totalData = await invoice.count();
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
    const totalRow = await invoice.count({
      where: {
        ...whereCondition,
        jurusan: {
          [Op.like]: jurusan,
        },
        kelas: {
          [Op.like]: kelas,
        },
        sub_kelas: {
          [Op.like]: subKelas,
        },
      },
      limit: limit,
      offset: offside,
      /// https://stackoverflow.com/a/33145634/18038473
      order: [["updatedAt", "DESC"]],
    });
    const totalPage = Math.ceil(totalRow / limit);

    const dataInvoice = await invoice.findAll({
      where: {
        ...whereCondition,
        jurusan: {
          [Op.like]: jurusan,
        },
        kelas: {
          [Op.like]: kelas,
        },
        sub_kelas: {
          [Op.like]: subKelas,
        },
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
export const getTotalInvoice = async (req, res) => {
  try {
    const responseInvoice = await invoice.findAll({
      where: {
        kode_tagihan: req.query.kode_tagihan,
      },
    });
    res.status(200).json(responseInvoice);
  } catch (error) {
    console.log(error);
  }
};
