import jwt from "jsonwebtoken";
import {logActivity} from "../Models/logActivity.js";
import {stafAuth} from "../Models/staf.js";

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
const FormatCurrency = (params) => {
  const resultAfterFormating = Number(params).toLocaleString("en-ID", {
    style: "currency",
    currency: "IDR",
  });
  const toRp = resultAfterFormating.replace("IDR", "Rp");
  return toRp;
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
  recordActivity,
  getUserInfoToken,
  invoiceGenerator,
  FormatCurrency,
  permissionAccess,
  getTotalTagihan,
};
