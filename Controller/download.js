import path from "path";
import { invoice } from "../Models/invoice.js";
import { siswaAuth } from "../Models/siswa.js";
import { jurusan } from "../Models/jurusan.js";
import moment from "moment";
import { Op } from "sequelize";
import exeljs from "exceljs";
import { FormatCurrency } from "../Configuration/supportFunction.js";
import { uid } from "uid";

export const downloadTemplateImportSiswa = async (req, res) => {
  try {
    await res.download(
      path.resolve("./Assets/template/template_import_siswa.xlsx")
    );
  } catch (error) {
    console.log(error);
  }
};
export const downloadFileExelTransaction = async (req, res) => {
  try {
    const { token } = req.params;
    await res.download(path.resolve(`./Assets/download/${token}`));
  } catch (error) {
    console.log(error);
  }
};
export const downloadTransaction = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const type = req.query.type_file;
    const offside = limit * page;
    const jurusan = req.query.jurusan || "%";
    const kelas = req.query.kelas || "%";
    const subKelas = req.query.sub_kelas || "%";
    /// https://stackoverflow.com/a/43127894/18038473
    const whereCondition = Boolean(endDate !== "null")
      ? {
          createdAt: {
            [Op.between]: [
              /// https://stackoverflow.com/a/12970385/18038473
              moment(moment(startDate).startOf("day")).format(
                "YYYY-MM-DD H:mm:ss"
              ),
              moment(moment(endDate).endOf("day")).format("YYYY-MM-DD H:mm:ss"),
            ],
          },
        }
      : {};
    const dataInvoice = await invoice.findAll({
      raw: true,
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
      order: [["id", "DESC"]],
    });
    const Workbook = new exeljs.Workbook();
    const worksheet = Workbook.addWorksheet("My Sheet");

    worksheet.columns = [
      {
        header: "No",
        key: "no",
        width: 6,
      },
      {
        header: "Nama siswa",
        key: "nama",
        width: 35,
      },
      {
        header: "Kelas",
        key: "kelas",
        width: 32,
      },
      {
        header: "Angkatan",
        key: "tahun_angkatan",
        width: 32,
      },
      {
        header: "Tunai",
        key: "uang_diterima",
        width: 32,
      },
      {
        header: "No. Invoice",
        key: "invoice",
        width: 32,
      },
      {
        header: "Keterangan",
        key: "kode_pembayaran",
        width: 32,
      },
    ];

    for (let index = 0; index < dataInvoice.length; index++) {
      worksheet.addRow({
        no: index + 1,
        nama: dataInvoice[index].nama,
        kelas: `${dataInvoice[index].kelas} ${dataInvoice[index].jurusan} ${dataInvoice[index].sub_kelas}`,
        tahun_angkatan: dataInvoice[index].tahun_angkatan,
        uang_diterima: FormatCurrency(dataInvoice[index].uang_diterima),
        invoice: dataInvoice[index].invoice,
        kode_pembayaran: dataInvoice[index].kode_pembayaran,
      });
      worksheet.getCell(`A${index + 2}`).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    }
    worksheet.getCell("A1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("B1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("C1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("D1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("E1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("F1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("G1").font = {
      size: 13,
      bold: true,
    };

    const fileName = `transaksi-${moment().format(
      "MMMM-Do-YYYY-h-mm-ss"
    )}_${uid(7).toUpperCase()}.xlsx`;
    const folderPlace = `./Assets/download/${fileName}`;
    await Workbook.xlsx.writeFile(folderPlace);
    await res.status(200).json({ data: fileName });
  } catch (error) {
    console.log(error);
  }
};
export const downloadStudentBill = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const angkatan = req.query.angkatan || "%";
  const currentBill = req.query.current_bill || "";
  const jurusanId = req.query.jurusanId || "%";
  const kelas = req.query.kelas || "%";
  const subKelas = req.query.sub_kelas || "%";
  const status = req.query.status || "%";
  const offside = limit * page;
  try {
    const data = await siswaAuth.findAll({
      raw: true,
      where: {
        current_bill: {
          [Op.or]: {
            [currentBill === "not_paid"
              ? Op.gt
              : currentBill === "paid" || currentBill === "not_paid_yet"
              ? Op.eq
              : currentBill === "deposit"
              ? Op.lt
              : Op.gt]: currentBill === "" ? -1 : 0,
            [currentBill === "" ||
            currentBill === "not_paid_yet" ||
            currentBill === "deposit"
              ? Op.lt
              : Op.gt]: 0,
          },
        },
        status_bill: {
          [Op.like]:
            currentBill === "not_paid_yet"
              ? "not_paid_yet"
              : currentBill === "paid"
              ? "paid"
              : "%",
        },
        angkatan: {
          [Op.like]: angkatan,
        },
        jurusanId: {
          [Op.like]: jurusanId,
        },
        kelas: {
          [Op.like]: kelas,
        },
        sub_kelas: {
          [Op.like]: subKelas,
        },
        status: {
          [Op.like]: status,
        },
        [Op.or]: [
          {
            nama: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            username: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            kode_siswa: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      limit: limit,
      offset: offside,
      order: [["id", "DESC"]],
      include: [{ model: jurusan }],
    });
    const Workbook = new exeljs.Workbook();
    const worksheet = Workbook.addWorksheet("My Sheet");

    worksheet.columns = [
      {
        header: "No",
        key: "no",
        width: 6,
      },
      {
        header: "Nama siswa",
        key: "nama",
        width: 35,
      },
      {
        header: "Gender",
        key: "gender",
        width: 10,
      },
      {
        header: "Kelas",
        key: "kelas",
        width: 32,
      },
      {
        header: "Angkatan",
        key: "angkatan",
        width: 15,
      },
      {
        header: "Tagihan terbayar",
        key: "total_payment",
        width: 32,
      },
      {
        header: "Status",
        key: "status_bill",
        width: 32,
      },
      {
        header: "Kekurangan tagihan",
        key: "current_bill",
        width: 32,
      },
      {
        header: "Nama Ayah",
        key: "nama_ayah",
        width: 32,
      },
      {
        header: "Nama Ibu",
        key: "nama_ibu",
        width: 32,
      },
      {
        header: "No. HP",
        key: "noHP",
        width: 32,
      },
      {
        header: "Alamat",
        key: "alamat",
        width: 32,
      },
    ];
    for (let index = 0; index < data.length; index++) {
      worksheet.addRow({
        no: index + 1,
        nama: data[index].nama,
        kelas: `${data[index].kelas} ${data[index]["jurusan.nama"]} ${data[index].sub_kelas}`,
        angkatan: data[index].angkatan,
        gender: data[index].gender,
        total_payment: FormatCurrency(data[index].total_payment),
        current_bill:
          data[index].current_bill < 0
            ? "-"
            : FormatCurrency(data[index].current_bill),
        status_bill:
          data[index].current_bill < 0
            ? "DEPOSIT"
            : data[index].current_bill > 0
            ? "BELUM LUNAS"
            : data[index].status_bill?.includes("BELUM ADA TAGIHAN")
            ? "BELUM ADA TAGIHAN"
            : "LUNAS",
        nama_ayah: data[index].nama_ayah,
        nama_ibu: data[index].nama_ibu,
        noHP: data[index].noHP,
        alamat: data[index].alamat,
      });
      worksheet.getCell(`A${index + 2}`).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    }
    worksheet.getCell("A1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("B1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("C1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("D1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("E1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("F1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("G1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("H1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("I1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("J1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("K1").font = {
      size: 13,
      bold: true,
    };
    worksheet.getCell("L1").font = {
      size: 13,
      bold: true,
    };

    const fileName = `tagihan-${moment().format("MMMM-Do-YYYY-h-mm-ss")}_${uid(
      7
    ).toUpperCase()}.xlsx`;
    const folderPlace = `./Assets/download/${fileName}`;
    await Workbook.xlsx.writeFile(folderPlace);
    await res.download(path.resolve(`./Assets/download/${fileName}`));
  } catch (error) {
    console.log(error);
  }
};
