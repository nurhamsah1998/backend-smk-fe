import { tagihanFix } from "../Models/tagihanFix.js";

export const getTagihanFix = async (req, res) => {
  try {
    const response = await tagihanFix.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
export const getTagihanFixForStudent = async (req, res) => {
  try {
    const response = await tagihanFix.findAll({
      where: {
        tahun_angkatan: req.query.tahun_angkatan,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
