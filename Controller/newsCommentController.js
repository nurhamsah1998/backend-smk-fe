import {Op} from "sequelize";
import {
  getUserInfoToken,
  isEmptyString,
} from "../Configuration/supportFunction";
import {news} from "../Models/news";
import {newsComment} from "../Models/newsComment";

export const postNewsComment = async (req, res) => {
  try {
    const {idStaff, idSiswa} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    const {text} = req.body;
    if (isEmptyString(text))
      return res.status(400).json({msg: "Judul tidak boleh kosong!"});
    await newsComment.create({
      text,
      ...(idStaff && {
        staff_id: idStaff,
      }),
      ...(idSiswa && {
        siswa_id: idSiswa,
      }),
    });
    res.status(201).json({msg: "Berhasil membuat kabar berita"});
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const updateNewsComment = async (req, res) => {
  try {
    const {idStaff, idSiswa} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    const {text} = req.body;
    if (isEmptyString(title))
      return res.status(400).json({msg: "Judul tidak boleh kosong!"});
    await news.update(
      {
        text,
      },
      {
        where: {
          id: req.params.id,
          [Op.or]: [
            {
              staff_id: idStaff,
            },
            {
              siswa_id: idSiswa,
            },
          ],
        },
      }
    );
    res.status(201).json({msg: "Berhasil mengubah kabar berita"});
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const deleteNewsComment = async (req, res) => {
  try {
    const {idStaff, idSiswa} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    const findNewsComment = await newsComment.findOne({
      where: {
        id: req.params.id,
        [Op.or]: [
          {
            staff_id: idStaff,
          },
          {
            siswa_id: idSiswa,
          },
        ],
      },
    });
    if (!findNewsComment) {
      return res.status(404).json({msg: "Gagal menghapus komentar"});
    }
    await newsComment.destroy({
      where: {
        id: req.params.i,
        staff_id: idStaff,
      },
    });
    res.status(201).json({msg: "Berhasil menghapus kabar berita"});
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const getMyNewsComment = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 40;
  const search = req.query.search || "";
  const offside = limit * page;
  const {idStaff} = getUserInfoToken(
    req.headers.authorization.replace("Bearer ", "")
  );
  try {
    const totalData = await newsComment.count();
    const totalRows = await newsComment.count({
      where: {
        staff_id: idStaff,
        [Op.or]: [
          {
            title: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });

    const totalPage = Math.ceil(totalRows / limit);
    let data = await newsComment.findAll({
      where: {
        staff_id: idStaff,
        [Op.or]: [
          {
            title: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      limit: limit,
      offset: offside,
      order: [["id", "DESC"]],
    });

    const response = {
      data: data,
      totalPage: totalPage,
      limit: limit,
      totalRows: totalRows,
      totalData,
      page: page + 1,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};
