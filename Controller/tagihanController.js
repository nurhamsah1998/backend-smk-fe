import { tagihan } from "../Models/tagihan.js";
import { jurusan } from "../Models/jurusan.js";
import { invoice } from "../Models/invoice.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

export const getTagihan = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const offset = limit * page;
  const search = req.query.search || "";
  const totalRows = await tagihan.count({
    where: {
      [Op.or]: [
        {
          kode_tagihan: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          nama: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });

  const totalPage = Math.ceil(totalRows / limit);
  const data = await tagihan.findAll({
    where: {
      [Op.or]: [
        {
          kode_tagihan: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          nama: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
    limit: limit,
    offset: offset,
    include: [{ model: jurusan }],
    order: [["id", "DESC"]],
  });
  try {
    const response = {
      data: data,
      totalPage: totalPage,
      limit: limit,
      totalRows: totalRows,
      page: page,
    };
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getTagihanBySiswa = async (req, res) => {
  const kode_tagihan = jwt.decode(
    req.headers.authorization.replace("Bearer ", "")
  );
  try {
    const response = await tagihan.findAll({
      include: { model: jurusan },
      where: {
        kode_tagihan: kode_tagihan.kode_tagihan,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getTagihanByKode = async (req, res) => {
  try {
    const responseInvoice = await invoice.findAll({
      where: {
        kode_tagihan: req.query.kode_tagihan,
      },
    });
    const stringInvoice = JSON.stringify(responseInvoice);
    const parseInvoice = JSON.parse(stringInvoice);
    const response = await tagihan.findAll({
      include: { model: jurusan },
      where: {
        kode_tagihan: req.params.kode_tagihan,
      },
    });
    const stringFrist = JSON.stringify(response);
    const parseThen = JSON.parse(stringFrist);
    const seoarateJson = parseThen.map((i) => ({
      ...i,
      periode: i.periode ? JSON.parse(i?.periode) : false,
    }));
    const result = seoarateJson?.map((i) => ({
      ...i,
      periode: i?.periode
        ? i?.periode?.map((x) => {
            const findIsSuccessPaid = parseInvoice?.find(
              (y) => y?.kode_pembayaran === x?.kode_bulan
            );
            if (findIsSuccessPaid) {
              return { ...x, invoice: findIsSuccessPaid, isPaid: true };
            }
            if (!findIsSuccessPaid) {
              return { ...x, isPaid: false };
            }
            return findIsSuccessPaid;
          })
        : false,
    }));
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

export const postTagihan = async (req, res) => {
  const { nama, deskripsi, angkatan, total, periode, jurusanId, kelas } =
    req.body;
  // const jsonPeriode = JSON.parse(periode);
  try {
    const findJurusan = await jurusan.findOne({
      where: {
        id: jurusanId,
      },
    });
    await tagihan.create({
      nama: nama,
      deskripsi: deskripsi,
      angkatan: angkatan,
      total: total,
      jurusanId: jurusanId,
      periode: periode,
      kelas: kelas,
      kode_tagihan: `${angkatan}${findJurusan.nama}${kelas}`,
    });
    console.log(periode, "===");
    res.status(201).json({ msg: "Tagihan berhasil dibuat." });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTagihan = async (req, res) => {
  try {
    await tagihan.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json({ msg: "Tagihan berhasil dihapus." });
  } catch (error) {
    console.log(error);
  }
};

export const updateTagihan = async (req, res) => {
  try {
    const response = await tagihan.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (response[0] === 0)
      return res.status(404).json({ msg: "id tidak ditemukan" });
    res.status(201).json({ msg: "Tagihan berhasil update." });
  } catch (error) {
    console.log(error);
  }
};
