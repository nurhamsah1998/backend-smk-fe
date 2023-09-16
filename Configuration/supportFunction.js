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
export { recordActivity, getUserInfoToken };
