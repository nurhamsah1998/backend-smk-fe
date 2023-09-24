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
export const getTotalInvoice = async (req, res) => {
  const responseInvoice = await invoice.findAll({
    where: {
      kode_tagihan: req.query.kode_tagihan,
    },
  });
  res.status(200).json(responseInvoice);
};
