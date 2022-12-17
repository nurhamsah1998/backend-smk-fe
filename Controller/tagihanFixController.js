import { tagihanFix } from "../Models/tagihanFix.js";

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
  await tagihanFix.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ msg: "update success" });
};
