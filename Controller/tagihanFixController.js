import {siswaAuth} from "../Models/siswa.js";
import {tagihanFix} from "../Models/tagihanFix.js";
import {
  getUserInfoToken,
  permissionAccess,
  recordActivity,
} from "../Configuration/supportFunction.js";
import {Op} from "sequelize";

export const getTagihanFix = async (req, res) => {
  const isNotAccess = await permissionAccess({
    token: req.headers.authorization.replace("Bearer ", ""),
    permission: "tagihan",
  });
  if (isNotAccess)
    return res
      .status(403)
      .json({msg: "Akses Ditolak, Anda tidak memiliki akses!"});
  const limit = parseInt(req.query.limit) || 3;
  const page = parseInt(req.query.page) - 1 || 0;
  try {
    const totalRows = await tagihanFix.count();
    const totalPage = Math.ceil(totalRows / limit);
    const listTagihan = await tagihanFix.findAll({
      limit,
      offset: limit * page,
      order: [["tahun_angkatan", "ASC"]],
    });
    const stringify = JSON.stringify(listTagihan);
    const parsefy = JSON.parse(stringify);
    /// stackoverflow-START
    /// question : https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
    /// answer by Wogan : https://stackoverflow.com/users/137902/wogan
    const educationYearsSort = parsefy.sort(
      (a, b) => a.tahun_angkatan - b.tahun_angkatan
    );
    /// stackoverflow-END
    const response = {
      data: educationYearsSort,
      totalPage,
      limit,
      page: page + 1,
    };
    res.status(200).json(response);
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
export const getTagihanFixForTU = async (req, res) => {
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
export const getTagihanFixForStudent = async (req, res) => {
  try {
    const {angkatan} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    const response = await tagihanFix.findAll({
      where: {
        tahun_angkatan: angkatan,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
export const getTahunAngkatan = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  const offside = limit * page;
  const totalData = await tagihanFix.count();
  try {
    const totalRows = await tagihanFix.count({
      // attributes: ["tahun_angkatan"],
      where: {
        [Op.or]: {
          tahun_angkatan: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
    });
    const data = await tagihanFix.findAll({
      /// https://stackoverflow.com/a/49053066/18038473
      attributes: ["tahun_angkatan"],
      raw: true,
      where: {
        [Op.or]: {
          tahun_angkatan: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      limit: limit,
      offset: offside,
      /// https://stackoverflow.com/a/36260326/18038473
      order: [["tahun_angkatan", "ASC"]],
    });
    const totalPage = Math.ceil(totalRows / limit);
    const response = {
      data: data,
      totalPage: totalPage,
      limit: limit,
      totalRows: totalRows,
      totalData,
      page: page + 1,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const updateTagihanFix = async (req, res) => {
  const isNotAccess = await permissionAccess({
    token: req.headers.authorization.replace("Bearer ", ""),
    permission: "tagihan",
  });
  if (isNotAccess)
    return res
      .status(403)
      .json({msg: "Perubahan Ditolak, Anda tidak memiliki akses!"});
  try {
    await siswaAuth.increment(
      {current_bill: req.body.extra.freq_bill},
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
    if (req.body.history.length > 0) {
      recordActivity({
        action: "Mengubah Tagihan",
        author: getUserInfoToken(
          req.headers.authorization.replace("Bearer ", "")
        ),
        data: req.body.history,
      });
    }

    res.status(200).json({msg: "Tagihan berhasil diubah"});
  } catch (error) {
    console.log(error);
  }
};
export const createTagihanFix = async (req, res) => {
  try {
    const currentTahunAngkatan = await tagihanFix.findAll({
      attributes: ["tahun_angkatan"],
      raw: true,
    });
    const findBigestYear = currentTahunAngkatan
      .sort((a, b) => b.tahun_angkatan - a.tahun_angkatan)
      .shift();
    const body = {
      tahun_angkatan: Number(findBigestYear.tahun_angkatan) + 1,
    };
    await tagihanFix.create(body);
    recordActivity({
      action: "Menambah Tagihan",
      author: getUserInfoToken(
        req.headers.authorization.replace("Bearer ", "")
      ),
      data: body,
    });
    res.status(200).json({msg: "Berhasil membuat tagihan baru"});
  } catch (error) {
    console.log(error);
  }
};
