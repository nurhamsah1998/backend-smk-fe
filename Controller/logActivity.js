import { logActivity } from "../Models/logActivity.js";

export const getActivity = async (req, res) => {
  try {
    const response = await logActivity.findAll({ raw: true });
    res.status(200).json({
      data: response.map((item) => ({
        ...item,
        author: JSON.parse(item.author),
        data: JSON.parse(item.data),
      })),
    });
  } catch (error) {
    console.log(error);
  }
};
