import { literal } from "sequelize";
import { siswaAuth } from "../Models/siswa.js";
import { tagihanFix } from "../Models/tagihanFix.js";
import {
  getUserInfoToken,
  recordActivity,
} from "../Configuration/supportFunction.js";

export const getTagihanFix = async (req, res) => {
  try {
    const response = await tagihanFix.findAll();
    const stringify = JSON.stringify(response);
    const parsefy = JSON.parse(stringify);
    /// stackoverflow-START
    /// question : https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
    /// answer by Wogan : https://stackoverflow.com/users/137902/wogan
    const educationYearsSort = parsefy.sort(
      (a, b) => a.tahun_angkatan - b.tahun_angkatan
    );
    /// stackoverflow-END
    res.status(200).json(educationYearsSort);
  } catch (error) {
    console.log(error);
  }
};
export const getTotalTagihanFix = async (req, res) => {
  try {
    const response = await tagihanFix.findAll({
      raw: true,
      where: {
        tahun_angkatan: req.query.tahun_angkatan,
      },
      attributes: {
        exclude: ["tahun_angkatan", "createdAt", "updatedAt", "id"],
      },
    });
    const total = Object.values(response[0] || {}).reduce((a, b) => a + b, 0);
    res.status(200).json(total);
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

export const updateTagihanFix = async (req, res) => {
  try {
    await siswaAuth.increment(
      { current_bill: req.body.extra.freq_bill },
      {
        where: {
          angkatan: req.body.tahun_angkatan,
        },
      }
    );
    delete req.body.extra;

    await tagihanFix.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    recordActivity({
      action: "Mengubah Tagihan",
      author: getUserInfoToken(
        req.headers.authorization.replace("Bearer ", "")
      ),
      data: req.body.history,
    });
    res.status(200).json({ msg: "update success" });
  } catch (error) {
    console.log(error);
  }
};
