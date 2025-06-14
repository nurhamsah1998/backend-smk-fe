import path, {join} from "path";
import {invoice} from "../Models/invoice.js";
import {siswaAuth} from "../Models/siswa.js";
import {jurusan} from "../Models/jurusan.js";
import fs from "fs";
import moment from "moment";
import {Op} from "sequelize";
import exeljs from "exceljs";
import {jsPDF as JSPDF} from "jspdf";
import autoTable from "jspdf-autotable";
import {FormatCurrency, KopPdf} from "../Configuration/supportFunction.js";
import {uid} from "uid";
import {invoiceOut} from "../Models/invoiceOut.js";

export const downloadTemplateImportSiswa = async (req, res) => {
  try {
    /// HOW TO
    /// https://github.com/exceljs/exceljs/issues/765#issuecomment-472912688
    // eslint-disable-next-line prefer-const
    let workBook = new exeljs.Workbook();
    // eslint-disable-next-line prefer-const
    let sheet = workBook.addWorksheet("template_import_siswa", {
      views: [{state: "frozen", ySplit: 1}],
    });
    sheet.columns = [
      {
        header: "Nama",
        key: "name",
        width: 40,
      },
      {
        header: "Username",
        key: "username",
        width: 40,
      },
      {
        header: "Password",
        key: "password",
        width: 40,
      },
      {
        header: "Jurusan",
        key: "kode_jurusan",
        width: 20,
      },
      {
        header: "Sub kelas",
        key: "sub_kelas",
        width: 20,
      },
      {
        header: "Kelas",
        key: "kelas",
        width: 20,
      },
      {
        header: "Kode siswa",
        key: "kode_siswa",
        width: 40,
      },
      {
        header: "Nomor HP",
        key: "noHP",
        width: 25,
      },
      {
        header: "Alamat siswa",
        key: "alamat",
        width: 75,
      },
      {
        header: "Nama ayah siswa",
        key: "nama_ayah",
        width: 30,
      },
      {
        header: "Nama ibu siswa",
        key: "nama_ibu",
        width: 30,
      },
      {
        header: "Jenis kelamin siswa",
        key: "gender",
        width: 40,
      },
    ];
    sheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "ff0000"},
    };
    sheet.getCell("B1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "ff0000"},
    };
    sheet.getCell("C1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "ff0000"},
    };
    sheet.getCell("D1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "ff0000"},
    };
    sheet.getCell("E1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "ff0000"},
    };
    sheet.getCell("F1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "ff0000"},
    };
    sheet.getCell("G1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "ff0000"},
    };
    sheet.getCell("H1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "00a933"},
    };
    sheet.getCell("I1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "00a933"},
    };
    sheet.getCell("J1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "00a933"},
    };
    sheet.getCell("K1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "00a933"},
    };
    sheet.getCell("L1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "00a933"},
    };
    ///
    sheet.getCell("A1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("B1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("C1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("D1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("E1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("F1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("G1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("H1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("I1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("J1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("K1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    sheet.getCell("L1").font = {
      color: {argb: "FFFFFFFF"},
      size: 16,
      name: "calibri",
      bold: true,
    };
    /// OPTIONS
    const dataJurusan = await jurusan.findAll({raw: true});
    for (let index = 2; index < 2000; index += 1) {
      sheet.getCell(`D${index}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [
          `"${dataJurusan?.map((item) => item?.kode_jurusan)?.toString()}"`,
        ],
      };
      sheet.getCell(`E${index}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"1","2","3","4","5","6"`],
      };
      sheet.getCell(`F${index}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"10","11","12"`],
      };
      sheet.getCell(`L${index}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"L","P"`],
      };
    }
    const fileName = `./Assets/template/template_import_siswa_${new Date().getTime()}.xlsx`;
    await workBook.xlsx.writeFile(join(process.cwd(), fileName));

    await res.download(path.resolve(fileName));
  } catch (error) {
    console.log(error);
  }
};
export const downloadFileExelTransaction = async (req, res) => {
  try {
    const {token} = req.params;
    await res.download(path.resolve(`./Assets/download/${token}`));
  } catch (error) {
    console.log(error);
  }
};
export const downloadTransactionIn = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 40;
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
              moment(startDate).startOf("day").toISOString(),
              moment(endDate).endOf("day").toISOString(),
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
    const isUserHasFilter =
      Boolean(req.query.kelas) ||
      Boolean(req.query.jurusan) ||
      Boolean(req.query.sub_kelas);
    const specifictFilter = ` ${isUserHasFilter ? "(" : ""} ${
      Boolean(req.query.kelas) ? `Kelas ${req.query.kelas}` : ""
    } ${Boolean(req.query.jurusan) ? `Jurusan ${req.query.jurusan}` : ""} ${
      Boolean(req.query.sub_kelas) ? `${req.query.sub_kelas}` : ""
    } ${isUserHasFilter ? ")" : ""}`;
    const Workbook = new exeljs.Workbook();
    const worksheet = Workbook.addWorksheet("My Sheet");
    const columns = [
      {
        header: "No",
        key: "no",
        width: 6,
        size: 13,
        bold: true,
        alphabet: "A",
      },
      {
        header: "Nama siswa",
        key: "nama",
        width: 35,
        size: 13,
        bold: true,
        alphabet: "B",
      },
      {
        header: "Kelas",
        key: "kelas",
        width: 15,
        size: 13,
        bold: true,
        alphabet: "C",
      },
      {
        header: "Angkatan",
        key: "tahun_angkatan",
        width: 15,
        size: 13,
        bold: true,
        alphabet: "D",
      },
      {
        header: "Tunai",
        key: "uang_diterima",
        width: 32,
        size: 13,
        bold: true,
        alphabet: "E",
      },
      {
        header: "No. Invoice",
        key: "invoice",
        width: 20,
        size: 13,
        bold: true,
        alphabet: "F",
      },
      {
        header: "Keterangan",
        key: "kode_pembayaran",
        width: 32,
        size: 13,
        bold: true,
        alphabet: "G",
      },
      {
        header: "Tanggal",
        key: "createdAt",
        width: 32,
        size: 13,
        bold: true,
        alphabet: "H",
      },
    ];
    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);
    const isSingleDate =
      dateStart.getDate() === dateEnd.getDate() &&
      dateStart.getMonth() === dateEnd.getMonth();
    /// https://stackoverflow.com/a/71738770/18038473
    worksheet.mergeCells("A1:H1");
    worksheet.getRow(1).height = 70;
    worksheet.getCell("A1").value = `LAPORAN TRANSAKSI SISWA \n Tanggal : ${
      Boolean(startDate !== "null")
        ? moment(startDate).format("DD MMMM YYYY")
        : "-"
    } ${
      !Boolean(isSingleDate) && Boolean(startDate !== "null")
        ? `- ${moment(endDate).format("DD MMMM YYYY")}`
        : ""
    }  \n Kelas : ${Boolean(req.query.kelas) ? req.query.kelas : "-"} ${
      Boolean(req.query.jurusan) ? req.query.jurusan : ""
    } ${Boolean(req.query.sub_kelas) ? req.query.sub_kelas : ""}`;
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell(`A1`).font = {
      size: 15,
      bold: true,
    };
    worksheet.getRow(2).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "2980ba"},
    };
    let header = [];
    let key = [];
    for (let index = 0; index < columns.length; index++) {
      key.push({key: columns[index].key, width: columns[index].width});
      header.push(columns[index].header);
      worksheet.getCell(`${columns[index].alphabet}2`).font = {
        size: 13,
        bold: true,
      };
    }
    worksheet.getRow(2).values = header;
    worksheet.columns = key;
    worksheet.getCell("A2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    for (let index = 0; index < columns.length; index++) {
      worksheet.getCell(`${columns[index].alphabet}2`).font = {
        size: columns[index].size,
        bold: columns[index].bold,
        color: {argb: "ffffff"},
      };
      worksheet.getCell(`${columns[index].alphabet}2`).alignment = {
        vertical: "middle",
      };
    }
    worksheet.getRow(2).height = 25;
    for (let index = 0; index < dataInvoice.length; index++) {
      worksheet.addRow({
        no: index + 1,
        nama: dataInvoice[index].nama,
        kelas: `${dataInvoice[index].kelas} ${dataInvoice[index].jurusan} ${dataInvoice[index].sub_kelas}`,
        tahun_angkatan: dataInvoice[index].tahun_angkatan,
        uang_diterima: FormatCurrency(dataInvoice[index].uang_diterima),
        invoice: dataInvoice[index].invoice,
        kode_pembayaran: dataInvoice[index].kode_pembayaran,
        createdAt: moment(dataInvoice[index].createdAt).format(
          "Do MMMM YYYY H:mm"
        ),
      });
      worksheet.getCell(`A${index + 3}`).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    }

    const fileName = `transaksi-masuk-${moment().format(
      "MMMM-Do-YYYY-h-mm-ss"
    )}_${uid(7).toUpperCase()}.xlsx`;
    const folderPlace = `./Assets/download/${fileName}`;
    await Workbook.xlsx.writeFile(folderPlace);
    await res.download(path.resolve(`./Assets/download/${fileName}`));
  } catch (error) {
    console.log(error);
  }
};
export const downloadTransactionOut = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 40;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const offside = limit * page;
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
    const dataInvoice = await invoiceOut.findAll({
      raw: true,
      where: {
        ...whereCondition,
      },
      limit: limit,
      offset: offside,
      order: [["id", "DESC"]],
    });
    const Workbook = new exeljs.Workbook();
    const worksheet = Workbook.addWorksheet("My Sheet");
    const columns = [
      {
        header: "No",
        key: "no",
        width: 6,
        size: 13,
        bold: true,
        alphabet: "A",
      },
      {
        header: "Nama",
        key: "nama",
        width: 35,
        size: 13,
        bold: true,
        alphabet: "B",
      },
      {
        header: "Uang keluar",
        key: "uang_keluar",
        width: 32,
        size: 13,
        bold: true,
        alphabet: "C",
      },
      {
        header: "Invoice pengeluaran",
        key: "invoice_pengeluaran",
        width: 20,
        size: 13,
        bold: true,
        alphabet: "D",
      },
      {
        header: "Petugas",
        key: "petugas",
        width: 32,
        size: 13,
        bold: true,
        alphabet: "E",
      },
      {
        header: "Note",
        key: "note",
        width: 32,
        size: 13,
        bold: true,
        alphabet: "F",
      },
      {
        header: "Tanggal",
        key: "createdAt",
        width: 32,
        size: 13,
        bold: true,
        alphabet: "G",
      },
    ];
    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);
    const isSingleDate =
      dateStart.getDate() === dateEnd.getDate() &&
      dateStart.getMonth() === dateEnd.getMonth();
    /// https://stackoverflow.com/a/71738770/18038473
    worksheet.mergeCells("A1:H1");
    worksheet.getRow(1).height = 70;
    worksheet.getCell("A1").value = `LAPORAN TRANSAKSI KELUAR \n Tanggal : ${
      Boolean(startDate !== "null")
        ? moment(startDate).format("DD MMMM YYYY")
        : "-"
    } ${
      !Boolean(isSingleDate) && Boolean(startDate !== "null")
        ? `- ${moment(endDate).format("DD MMMM YYYY")}`
        : ""
    }`;
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell(`A1`).font = {
      size: 15,
      bold: true,
    };
    worksheet.getRow(2).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {argb: "2980ba"},
    };
    let header = [];
    let key = [];
    for (let index = 0; index < columns.length; index++) {
      key.push({key: columns[index].key, width: columns[index].width});
      header.push(columns[index].header);
      worksheet.getCell(`${columns[index].alphabet}2`).font = {
        size: 13,
        bold: true,
      };
    }
    worksheet.getRow(2).values = header;
    worksheet.columns = key;
    worksheet.getCell("A2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    for (let index = 0; index < columns.length; index++) {
      worksheet.getCell(`${columns[index].alphabet}2`).font = {
        size: columns[index].size,
        bold: columns[index].bold,
        color: {argb: "ffffff"},
      };
      worksheet.getCell(`${columns[index].alphabet}2`).alignment = {
        vertical: "middle",
      };
    }
    worksheet.getRow(2).height = 25;
    for (let index = 0; index < dataInvoice.length; index++) {
      worksheet.addRow({
        no: index + 1,
        nama: dataInvoice[index].nama,
        uang_keluar: FormatCurrency(dataInvoice[index].uang_keluar),
        invoice_pengeluaran: dataInvoice[index].invoice_pengeluaran,
        petugas: dataInvoice[index].petugas,
        note: dataInvoice[index].note,
        createdAt: moment(dataInvoice[index].createdAt).format(
          "Do MMMM YYYY H:mm"
        ),
      });
      worksheet.getCell(`A${index + 3}`).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    }

    const fileName = `transaksi-keluar-${moment().format(
      "MMMM-Do-YYYY-h-mm-ss"
    )}_${uid(7).toUpperCase()}.xlsx`;
    const folderPlace = `./Assets/download/${fileName}`;
    await Workbook.xlsx.writeFile(folderPlace);
    await res.download(path.resolve(`./Assets/download/${fileName}`));
  } catch (error) {
    console.log(error);
  }
};
export const downloadStudentBill = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const fileType = req.query.type || "";
  const angkatan = req.query.angkatan || "%";
  const currentBill = req.query.current_bill || "";
  const jurusanId = req.query.jurusanId || "%";
  const kelas = req.query.kelas || "%";
  const subKelas = req.query.sub_kelas || "%";
  const status = req.query.status || "%";
  const offside = limit * page;
  const tableHead = [
    {
      id: "nama",
      label: "Nama siswa",
    },
    {
      id: "kelas_student",
      label: "Kelas",
    },
    {
      id: "angkatan",
      label: "Angkatan",
    },
    {
      id: "status_bill",
      label: "Status",
      variantStatusColor: [
        {
          variant: "success",
          label: "Lunas",
          value: "paid",
        },
        {
          variant: "error",
          label: "Belum Lunas",
          value: "not_paid",
        },
        {
          variant: "grey",
          label: "Belum Ada Tagihan",
          value: "not_paid_yet",
        },
        {
          variant: "warning",
          label: "Deposit",
          value: "deposit",
        },
      ],
    },
    {
      id: "current_bill",
      label: "Kekurangan",
      isCurrency: true,
    },
  ];
  const billStatus = [
    {
      name: "deposit",
      title: "DEPOSIT",
    },
    {
      name: "not_paid_yet",
      title: "BELUM ADA TAGIHAN",
    },
    {
      name: "paid",
      title: "LUNAS",
    },
    {
      name: "not_paid",
      title: "BELUM LUNAS",
    },
  ];
  if (!fileType) {
    return await res.status(400).json({msg: "invalid file type"});
  }
  try {
    const jurusanById = await jurusan.findOne({
      raw: true,
      where: {
        id: jurusanId,
      },
    });
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
      include: [{model: jurusan}],
    });
    if (fileType === "pdf") {
      const dataFIlePDF = data
        ?.map((item) => ({
          nama: item?.nama,
          kelas_student: `${item?.kelas} ${item?.["jurusan.kode_jurusan"]} ${item?.sub_kelas}`,
          angkatan: item?.angkatan,
          status_bill:
            item?.current_bill < 0
              ? "DEPOSIT"
              : item?.current_bill > 0
              ? "BELUM LUNAS"
              : item?.status_bill?.includes("BELUM ADA TAGIHAN")
              ? "BELUM ADA TAGIHAN"
              : "LUNAS",
          /// https://stackoverflow.com/a/4652112/18038473
          current_bill:
            item?.current_bill < 0
              ? `+ ${FormatCurrency(Math.abs(item?.current_bill))}`
              : FormatCurrency(item?.current_bill),
        }))
        ?.map((item) => {
          return Object.values(item);
        });
      const doc = new JSPDF({
        orientation: "p",
        unit: "mm",
        format: "legal",
      });
      autoTable(doc, {
        html: "#my-table",
        margin: {top: 70},
      });
      KopPdf(doc);
      doc.setFontSize(14);
      doc.setFont("", "", 700);
      doc.text(`Laporan Tagihan`, 10, 60, {
        align: "left",
      });
      doc.setFont("", "", "");
      doc.setFontSize(12);
      doc.setFontSize(10);
      doc.setFont("", "", "");
      doc.text(
        `Kelas : ${
          Boolean(kelas !== "%") &&
          Boolean(jurusan) &&
          Boolean(subKelas !== "%")
            ? `${kelas} ${jurusanById?.kode_jurusan} ${subKelas} ${
                Boolean(angkatan !== "%") ? `/ ${angkatan}` : ""
              }`
            : "-"
        }`,
        10,
        65,
        {
          align: "left",
        }
      );
      doc.setFontSize(10);
      doc.text(
        `Status pembayaran : ${
          Boolean(currentBill)
            ? billStatus?.find((item) => item.name === currentBill)?.title
            : "-"
        }`,
        10,
        69,
        {
          align: "left",
        }
      );
      doc.text(
        `Tanggal dibuat : ${moment().format("Do MMM YYYY H:mm")}`,
        10,
        73,
        {
          align: "left",
        }
      );
      autoTable(doc, {
        margin: {horizontal: 10},
        head: [tableHead?.map((item) => item?.label)],
        body: dataFIlePDF,
      });
      doc.text(
        `SMK PGRI KRAS`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 7,
        {
          align: "center",
        }
      );
      const fileName = `tagihan-${moment().format(
        "MMMM-Do-YYYY-h-mm-ss"
      )}_${uid(7).toUpperCase()}.${fileType}`;
      const filePath = path.resolve(`./Assets/download/${fileName}`);
      const bufferFile = doc.output("arraybuffer");
      fs.writeFileSync(filePath, Buffer.from(bufferFile));
      return await res.download(filePath);
    }
    if (fileType === "xlsx") {
      const Workbook = new exeljs.Workbook();
      const worksheet = Workbook.addWorksheet("My Sheet");

      const columns = [
        {
          header: "No",
          key: "no",
          width: 6,
          size: 13,
          bold: true,
          alphabet: "A",
        },
        {
          header: "Nama siswa",
          key: "nama",
          width: 35,
          size: 13,
          bold: true,
          alphabet: "B",
        },
        {
          header: "Gender",
          key: "gender",
          width: 10,
          size: 13,
          bold: true,
          alphabet: "C",
        },
        {
          header: "Kelas",
          key: "kelas",
          width: 32,
          size: 13,
          bold: true,
          alphabet: "D",
        },
        {
          header: "Angkatan",
          key: "angkatan",
          width: 15,
          size: 13,
          bold: true,
          alphabet: "E",
        },
        {
          header: "Tagihan terbayar",
          key: "total_payment",
          width: 32,
          size: 13,
          bold: true,
          alphabet: "F",
        },
        {
          header: "Status",
          key: "status_bill",
          width: 32,
          size: 13,
          bold: true,
          alphabet: "G",
        },
        {
          header: "Kekurangan tagihan",
          key: "current_bill",
          width: 32,
          size: 13,
          bold: true,
          alphabet: "H",
        },
        {
          header: "Nama Ayah",
          key: "nama_ayah",
          width: 32,
          size: 13,
          bold: true,
          alphabet: "I",
        },
        {
          header: "Nama Ibu",
          key: "nama_ibu",
          width: 32,
          size: 13,
          bold: true,
          alphabet: "J",
        },
        {
          header: "No. HP",
          key: "noHP",
          width: 32,
          size: 13,
          bold: true,
          alphabet: "K",
        },
        {
          header: "Alamat",
          key: "alamat",
          width: 32,
          size: 13,
          bold: true,
          alphabet: "L",
        },
      ];
      const billStatus = [
        {
          name: "deposit",
          title: "DEPOSIT",
        },
        {
          name: "not_paid_yet",
          title: "BELUM ADA TAGIHAN",
        },
        {
          name: "paid",
          title: "LUNAS",
        },
        {
          name: "not_paid",
          title: "BELUM LUNAS",
        },
      ];
      /// https://stackoverflow.com/a/71738770/18038473
      worksheet.mergeCells("A1:H1");
      worksheet.getRow(1).height = 70;
      worksheet.getCell("A1").value = `LAPORAN TAGIHAN SISWA \n Kelas : ${
        Boolean(req.query.kelas) ? req.query.kelas : "-"
      } ${Boolean(jurusanById?.nama) ? jurusanById?.kode_jurusan : ""} ${
        Boolean(req.query.sub_kelas) ? req.query.sub_kelas : ""
      } ${
        Boolean(req.query.angkatan) ? ` ${req.query.angkatan}` : ""
      } \n Status pembayaran : ${
        Boolean(req.query.current_bill)
          ? billStatus.find((item) => item.name === currentBill).title
          : "-"
      }`;
      worksheet.getCell("A1").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getCell(`A1`).font = {
        size: 15,
        bold: true,
      };
      worksheet.getRow(2).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {argb: "2980ba"},
      };
      let header = [];
      let key = [];
      for (let index = 0; index < columns.length; index++) {
        key.push({key: columns[index].key, width: columns[index].width});
        header.push(columns[index].header);
        worksheet.getCell(`${columns[index].alphabet}2`).font = {
          size: 13,
          bold: true,
        };
      }
      worksheet.getRow(2).values = header;
      worksheet.columns = key;
      worksheet.getCell("A2").alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      for (let index = 0; index < columns.length; index++) {
        worksheet.getCell(`${columns[index].alphabet}2`).font = {
          size: columns[index].size,
          bold: columns[index].bold,
          color: {argb: "ffffff"},
        };
        worksheet.getCell(`${columns[index].alphabet}2`).alignment = {
          vertical: "middle",
        };
      }
      worksheet.getRow(2).height = 25;
      for (let index = 0; index < data.length; index++) {
        worksheet.addRow({
          no: index + 1,
          nama: data[index].nama,
          kelas: `${data[index].kelas} ${data[index]["jurusan.kode_jurusan"]} ${data[index].sub_kelas}`,
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
        worksheet.getCell(`A${index + 3}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      }
      const fileName = `tagihan-${moment().format(
        "MMMM-Do-YYYY-h-mm-ss"
      )}_${uid(7).toUpperCase()}.${fileType}`;
      const folderPlace = `./Assets/download/${fileName}`;
      await Workbook.xlsx.writeFile(folderPlace);
      return await res.download(path.resolve(`./Assets/download/${fileName}`));
    }
  } catch (error) {
    console.log(error);
  }
};
