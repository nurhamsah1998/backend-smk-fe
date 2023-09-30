import { invoice } from "../Models/invoice.js";
import jwt from "jsonwebtoken";
import { uid } from "uid";
import { Op } from "sequelize";

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
  } = req.body;
  try {
    const body = {
      nama: nama,
      total: total,
      petugas: petugas,
      note: note,
      kode_tagihan: kode_tagihan,
      kode_pembayaran: kode_pembayaran,
      uang_diterima: uang_diterima,
      kelas,
      invoice: `INV-${uid(7).toUpperCase()}`,
    };
    const data = await invoice.create(body);
    res.status(201).json({ msg: "Transaksi berhasil", data: data });
  } catch (error) {
    console.log(error);
  }
};

export const getInvoice = async (req, res) => {
  const responseInvoice = await invoice.findAll({
    where: {
      kode_tagihan: req.query.kode_tagihan,
    },
  });
  res.status(200).json(responseInvoice);
};
export const getAllInvoice = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const offside = limit * page;
    const totalData = await invoice.count();
    const totalRow = await invoice.count({
      limit: limit,
      offset: offside,
      order: [["id", "DESC"]],
    });
    const totalPage = Math.ceil(totalRow / limit);

    const responseInvoice = await invoice.findAll({
      limit: limit,
      offset: offside,
      order: [["id", "DESC"]],
    });
    res.status(200).json({
      data: responseInvoice,
      totalRows: totalRow,
      totalPage: totalPage,
      limit: limit,
      page: page + 1,
      totalData,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getTotalInvoice = async (req, res) => {
  const responseInvoice = await invoice.findAll({
    where: {
      kode_tagihan: req.query.kode_tagihan,
    },
  });
  res.status(200).json(responseInvoice);
};
