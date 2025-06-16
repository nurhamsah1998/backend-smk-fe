import jwt from "jsonwebtoken";
import {logActivity} from "../Models/logActivity.js";
import {stafAuth} from "../Models/staf.js";
import autoTable from "jspdf-autotable";
import fs from "fs";
import moment from "moment";

const recordActivity = async ({action, data, author}) => {
  try {
    await logActivity.create({
      action,
      data,
      author,
    });
  } catch (error) {
    console.log(error);
  }
};

const FormatCurrency = (params) => {
  const resultAfterFormating = Number(params).toLocaleString("en-ID", {
    style: "currency",
    currency: "IDR",
  });
  const toRp = resultAfterFormating.replace("IDR", "Rp");
  return toRp;
};

export const KopPdf = (doc) => {
  const imgPath = "./Assets/image/logo_pgri.png";
  const fileImage = fs.readFileSync(imgPath);
  const dataURI = `data:image/png;base64,${fileImage?.toString("base64")}`;
  doc.addImage(dataURI, "png", 10, 5, 30, 30);
  /// https://stackoverflow.com/a/64022128/18038473
  doc.setFontSize(14);
  doc.setFont("", "", 700);
  doc.text(
    "YAYASAN PEMBINA LEMBAGA PENDIDIKAN",
    doc.internal.pageSize.width / 1.7,
    15,
    {align: "center"}
  );
  doc.text(
    "PERSATUAN GURU REPUBLIK INDONESIA (YPLP PGRI) KEDIRI",
    doc.internal.pageSize.width / 1.7,
    22,
    {
      align: "center",
    }
  );
  doc.text(
    "SEKOLAH MENENGAH KEJURUAN PGRI KRAS KEDIRI",
    doc.internal.pageSize.width / 1.7,
    29,
    {
      align: "center",
    }
  );
  doc.setFontSize(12);
  doc.setFont("", "", "", "");
  doc.text(
    "Jalan Raya Desa Kras Kec. Kras Kab. Kediri",
    doc.internal.pageSize.width / 1.7,
    38,
    {
      align: "center",
    }
  );
  doc.text(
    "Telp. 0354-479487 e-mail: smk_pgri_kras007@yahoo.co.id",
    doc.internal.pageSize.width / 1.7,
    43,
    {
      align: "center",
    }
  );
  /// https://stackoverflow.com/a/53360710/18038473
  doc.setLineWidth(1.0);
  doc.line(10, 50, 201, 50, "FD");
  doc.setLineWidth(0);
  doc.line(10, 51, 201, 51, "FD");
};

export const pdfSuratTagihan = (
  doc,
  data,
  nomorRef,
  startUjian,
  expiredDate
) => {
  try {
    const imgPath = "./Assets/image/stampel.png";
    const fileImage = fs.readFileSync(imgPath);
    const dataURI = `data:image/png;base64,${fileImage?.toString("base64")}`;
    // autoTable(doc, {
    //   html: "#my-table",
    //   margin: {top: 70},
    // });
    KopPdf(doc);
    doc.text(`No    : ${nomorRef}`, 10, 59, {
      align: "left",
    });
    doc.text(`Hal   : PEMBERITAHUAN`, 10, 65, {
      align: "left",
    });
    /// KEPADA YTH
    doc.text(`Kepada :`, 10, 75, {
      align: "left",
    });
    doc.text(
      `Yth. Bapak / Ibu Wali Murid ${data?.nama?.toUpperCase()}`,
      10,
      81,
      {
        align: "left",
      }
    );
    doc.text(
      `Kelas ${data?.kelas} ${data["jurusan.kode_jurusan"]} ${data?.sub_kelas}`,
      10,
      87,
      {
        align: "left",
      }
    );
    doc.text("Di tempat", 10, 93, {
      align: "left",
    });
    doc.setFont("", "", 700);
    doc.text("Assalamualaikum Wr. Wb", 10, 113, {
      align: "left",
    });
    doc.setFont("", "", "");
    doc.text(
      `Diberitahukan dengan hormat bahwa ujian sekolah akan dilaksanakan mulai ${moment(
        startUjian
      ).format("Do MMMM YYYY")}. Sehubungan `,
      10,
      122,
      {
        align: "left",
      }
    );
    doc.text(
      `dengan ini maka kami mohon dengan hormat agar Bapak / Ibu / Wali murid segera melunasi tanggungan`,
      10,
      128,
      {
        align: "left",
      }
    );
    /// https://stackoverflow.com/a/25675981/18038473
    const widthTextOne = doc.getTextWidth(
      "pembayaran Sekolah puta putri bapak ibu yang bernama "
    );
    doc.text(`pembayaran Sekolah puta putri bapak ibu yang bernama `, 10, 134, {
      align: "left",
    });
    doc.setFont("", "", 700);
    const lineTextWidth = doc.getTextWidth(data?.nama?.toUpperCase());
    doc.line(widthTextOne + 10, 135, widthTextOne + lineTextWidth + 10, 135);

    doc.text(`${data?.nama?.toUpperCase()}`, widthTextOne + 10, 134, {
      align: "left",
    });
    doc.setFont("", "", "");
    doc.text(
      `Paling akhir tanggal ${moment(expiredDate).format(
        "Do MMMM YYYY"
      )} kepada petugas di Sekolah.`,
      10,
      140,
      {
        align: "left",
      }
    );
    const lengthTextBeforeAmount = doc.getTextWidth(
      "Adapun tanggungan yang harus dilunasi adalah sebesar "
    );
    doc.text(`Adapun tanggungan yang harus dilunasi adalah sebesar`, 10, 146, {
      align: "left",
    });
    doc.setFont("", "", 700);
    doc.text(
      `${FormatCurrency(data?.current_bill || 0)}`,
      lengthTextBeforeAmount + 10,
      146,
      {
        align: "left",
      }
    );
    doc.setFont("", "", "");
    doc.text(`Demikian atas kerja samanya di ucapkan terima kasih.`, 10, 166, {
      align: "left",
    });
    doc.text(
      `Semoga rahmad dan pertolongan Allah selalu dilimpahkan pada kita bersama.`,
      10,
      172,
      {
        align: "left",
      }
    );
    doc.setFont("", "", 700);
    doc.text(`Wassalamu'alaikum Wr. Wb.`, 10, 181, {
      align: "left",
    });
    doc.setFont("", "", "");
    doc.addImage(
      dataURI,
      "png",
      doc.internal.pageSize.width - 135 / 2,
      doc.internal.pageSize.height / 2 + 69,
      38,
      38
    );
    doc.text(
      `Kras, ${moment().format("Do MMMM YYYY")}`,
      doc.internal.pageSize.width - 90 / 2,
      doc.internal.pageSize.height / 3 + 130,
      {
        align: "center",
      }
    );
    doc.text(
      `Kepala SMK PGRI Kras`,
      doc.internal.pageSize.width - 90 / 2,
      doc.internal.pageSize.height / 3 + 135,
      {
        align: "center",
      }
    );
    doc.setFont("", "", 700);
    doc.text(
      `SUWARNI,S.Pd i`,
      doc.internal.pageSize.width - 90 / 2,
      doc.internal.pageSize.height / 3 + 155,
      {
        align: "center",
      }
    );
    doc.setFont("", "", "");
    doc.setFontSize(9);
    doc.setFont("", "italic");
    doc.text(
      `Surat tagihan ini dicetak secara otomatis menggunakan sistem aplikasi sekolah.`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 20,
      {
        align: "center",
      }
    );
    doc.text(
      `Jika dirasa ada yang tidak sesuai berkaitan dengan nominal tagihan dll, bisa menghubungi ke petugas.`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 16,
      {
        align: "center",
      }
    );
    doc.text(
      `Terimakasih`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 12,
      {
        align: "center",
      }
    );
  } catch (error) {
    throw error;
  }
};

const getTotalTagihan = (data, year) => {
  try {
    let x = data.find((item) => item.tahun_angkatan === year);
    delete x.tahun_angkatan;
    return Object.values(x).reduce((a, b) => a + b, 0);
  } catch (error) {
    return 0;
  }
};
const invoiceGenerator = (arg) => {
  const date = new Date();
  const codeTime = `${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}`;
  const total = "000".slice(0, 3 - String(arg).length);
  return codeTime + total + String(arg);
};

const getUserInfoToken = (token) => {
  return jwt.decode(token);
};

const isEmptyString = (text) => {
  if (typeof text === "undefined") return true;
  return !Boolean(String(text).match(/\S/g));
};

const permissionAccess = async ({token, permission = ""}) => {
  const {idStaff} = getUserInfoToken(token) || {};
  const userInfo = await stafAuth.findByPk(idStaff, {raw: true});
  const permissions = userInfo
    ? typeof userInfo.permissions === "string"
      ? JSON.parse(userInfo.permissions)
      : userInfo.permissions
    : [];
  return !Boolean(permissions.find((item) => item === permission));
};
export {
  isEmptyString,
  recordActivity,
  getUserInfoToken,
  invoiceGenerator,
  FormatCurrency,
  permissionAccess,
  getTotalTagihan,
};
