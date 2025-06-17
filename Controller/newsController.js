import path from "path";
import {
  getUserInfoToken,
  isEmptyString,
} from "../Configuration/supportFunction.js";
import {news} from "../Models/news.js";
import {stafAuth} from "../Models/staf.js";
import mime from "mime";
import {Op} from "sequelize";

export const postNews = async (req, res) => {
  try {
    const {idStaff} = getUserInfoToken(
      req.headers.authorization.replace("Bearer ", "")
    );
    const {title, html, isPublish} = req.body;
    if (isEmptyString(title))
      return res.status(400).json({msg: "Judul tidak boleh kosong!"});
    await news.create({
      staff_id: idStaff,
      title,
      html,
      isPublish,
    });
    res.status(201).json({msg: "Berhasil membuat kabar berita"});
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const storeNewsImage = async (req, res) => {
  try {
    const pathUrl = req.file.filename;
    res
      .status(201)
      .json({url: pathUrl, alt: `PRE_${req.file.filename}`, href: pathUrl});
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const getNewsImage = async (req, res) => {
  try {
    const readImage = path.resolve(`./Assets/image/${req?.params?.img}`);
    const lookupMime = mime.lookup(readImage);
    res.setHeader("content-type", lookupMime);
    res.sendFile(readImage);
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const updateNews = async (req, res) => {
  try {
    const {idStaff} = getUserInfoToken(
      req.headers.authorization.replace("Bearer ", "")
    );
    const {title, html, isPublish} = req.body;
    if (isEmptyString(title))
      return res.status(400).json({msg: "Judul tidak boleh kosong!"});
    await news.update(
      {
        title,
        html,
        isPublish,
      },
      {
        where: {
          id: req.params.i,
          staff_id: idStaff,
        },
      }
    );
    res.status(201).json({msg: "Berhasil mengubah kabar berita"});
  } catch (error) {
    res.status(500).json({msg: error?.message});
  }
};

export const deleteNews = async (req, res) => {
  try {
    const findNews = await news.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!findNews) {
      return res.status(404).json({msg: "Gagal menghapus kabar berita"});
    }
    await news.destroy({
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

export const getAllNews = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 40;
  const search = req.query.search || "";
  const offside = limit * page;
  try {
    const totalData = await news.count();
    const totalRows = await news.count({
      where: {
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
    let data = await news.findAll({
      raw: true,
      where: {
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
      include: [{model: stafAuth, attributes: ["nama"]}],
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

export const getMyNews = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 40;
  const search = req.query.search || "";
  const offside = limit * page;
  const {idStaff} = getUserInfoToken(
    req.headers.authorization.replace("Bearer ", "")
  );
  try {
    const totalData = await news.count();
    const totalRows = await news.count({
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
    let data = await news.findAll({
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
