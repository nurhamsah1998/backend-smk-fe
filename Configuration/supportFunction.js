import jwt from "jsonwebtoken";
import { logActivity } from "../Models/logActivity.js";

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
export { recordActivity, getUserInfoToken, FormatCurrency };
