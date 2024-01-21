import jwt from "jsonwebtoken";
import { logActivity } from "../Models/logActivity.js";
import { stafAuth } from "../Models/staf.js";

const recordActivity = async ({ action, data, author }) => {
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

const permissionAccess = async ({ token, permission = "" }) => {
  const { idStaff } = getUserInfoToken(token) || {};
  const userInfo = await stafAuth.findByPk(idStaff, { raw: true });
  const permissions = userInfo ? JSON.parse(userInfo.permissions) : [];
  return !Boolean(permissions.find((item) => item === permission));
};
export { recordActivity, getUserInfoToken, FormatCurrency, permissionAccess };
