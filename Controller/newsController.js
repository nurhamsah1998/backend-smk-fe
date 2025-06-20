import path from "path";
import {
  getUserInfoToken,
  isEmptyString,
  permissionAccess,
  textEllipsis,
} from "../Configuration/supportFunction.js";
import {news} from "../Models/news.js";
import {stafAuth} from "../Models/staf.js";
import mime from "mime";
import {Op} from "sequelize";
import fs from "fs";
import {newsComment} from "../Models/newsComment.js";
import {newsReaction} from "../Models/newsReaction.js";
import database from "../Configuration/database.js";
import {newsCommentReaction} from "../Models/newsCommentReaction.js";
import striptags from "striptags";

export const postNews = async (req, res) => {
  try {
    await permissionAccess({
      req,
      res,
      permission: "cud_news",
    });
    const {idStaff} = getUserInfoToken(
      req.headers.authorization.replace("Bearer ", "")
    );

    const hasFile = Boolean(req.file);
    let thumbnailPath = null;
    if (hasFile) {
      thumbnailPath = `./Assets/news/thumbnail/${req.file.filename?.replaceAll(
        " ",
        "-"
      )}`;
      /// JIKA FILE THUMBNAIL TIDAK ADA
      if (!fs.existsSync(path.resolve(thumbnailPath)))
        return res.status(400).json({msg: "Thumbnail tidak ditemukan"});
      if (req.file.size > 1731986) {
        fs.unlink(thumbnailPath, (error) => {
          if (error) throw error;
        });
        return res.status(400).json({
          msg: "Ukuran thumbnail terlalu besar, setidaknya dibawah 1.5Mb",
        });
      }
    }
    const {title, html, isPublish, isPrivate} = req.body;

    if (isEmptyString(title)) {
      if (hasFile) {
        fs.unlink(path.resolve(thumbnailPath), (error) => {
          if (error) throw error;
        });
      }
      return res.status(400).json({msg: "Judul tidak boleh kosong!"});
    }
    await news.create({
      staff_id: idStaff,
      title,
      html,
      isPublish,
      isPrivate,
      ...(hasFile && {thumbnail: req.file.filename}),
    });
    res.status(201).json({msg: "Berhasil membuat kabar berita"});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

export const storeNewsImage = async (req, res) => {
  try {
    await permissionAccess({
      req,
      res,
      permission: "cud_news",
    });
    const pathUrl = req.file.filename;
    const contentImagePath = `./Assets/news/content/${req.file.filename?.replaceAll(
      " ",
      "-"
    )}`;
    if (req.file.size > 1731986) {
      fs.unlink(contentImagePath, (error) => {
        if (error) throw error;
      });
      return res.status(400).json({
        msg: "Ukuran terlalu besar, setidaknya dibawah 1.5Mb",
      });
    }
    res.status(201).json({
      url: pathUrl,
      alt: `PRE_${req.file.filename?.replaceAll(" ", "-")}`,
      href: pathUrl,
    });
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

export const getNewsImage = async (req, res) => {
  try {
    const readImage = path.resolve(`./Assets/news/content/${req?.params?.img}`);
    const lookupMime = mime.lookup(readImage);
    res.setHeader("content-type", lookupMime);
    res.sendFile(readImage);
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

export const getNewsThumbnailImage = async (req, res) => {
  try {
    const readImage = path.resolve(
      `./Assets/news/thumbnail/${req?.params?.img}`
    );
    const lookupMime = mime.lookup(readImage);
    res.setHeader("content-type", lookupMime);
    res.sendFile(readImage);
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

export const updateNews = async (req, res) => {
  try {
    await permissionAccess({
      req,
      res,
      permission: "cud_news",
    });
    const {idStaff} = getUserInfoToken(
      req.headers.authorization.replace("Bearer ", "")
    );
    const {title, html, isPublish, isPrivate} = req.body;
    const findCurrentNews = await news.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "thumbnail"],
    });
    const hasFile = Boolean(req.file);
    let reqFileName = null;
    let newThumbnailPath = null;
    let oldThumbnailPath = null;
    if (hasFile) {
      reqFileName = req.file.filename?.replaceAll(" ", "-");
      oldThumbnailPath =
        "./Assets/news/thumbnail/" + findCurrentNews?.thumbnail;
      newThumbnailPath = "./Assets/news/thumbnail/" + reqFileName;

      if (req.file.size > 1731986) {
        fs.unlink(path.resolve(newThumbnailPath), (error) => {
          if (error) throw error;
        });
        return res.status(400).json({
          msg: "Ukuran thumbnail terlalu besar, setidaknya dibawah 1.5Mb",
        });
      }
      /// HAPUS FOTO LAMA
      if (
        newThumbnailPath !== findCurrentNews.thumbnail &&
        fs.existsSync(path.resolve(oldThumbnailPath))
      ) {
        fs.unlink(path.resolve(oldThumbnailPath), (error) => {
          if (error) throw error;
        });
      }
      if (!fs.existsSync(path.resolve(newThumbnailPath)))
        return res.status(400).json({msg: "Thumbnail tidak ditemukan"});
    }

    if (isEmptyString(title)) {
      if (hasFile) {
        fs.unlink(path.resolve(oldThumbnailPath), (error) => {
          if (error) throw error;
        });
      }
      return res.status(400).json({msg: "Judul tidak boleh kosong!"});
    }
    await news.update(
      {
        title,
        html,
        isPublish,
        isPrivate,
        ...(hasFile &&
          newThumbnailPath !== findCurrentNews.thumbnail && {
            thumbnail: reqFileName,
          }),
      },
      {
        where: {
          id: req.params.id,
          staff_id: idStaff,
        },
      }
    );
    res.status(201).json({msg: "Berhasil mengubah kabar berita"});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

export const deleteNews = async (req, res) => {
  try {
    await permissionAccess({
      req,
      res,
      permission: "cud_news",
    });
    const {idStaff} = getUserInfoToken(
      req.headers.authorization.replace("Bearer ", "")
    );
    const findNews = await news.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: newsComment,
        attributes: ["id"],
      },
    });
    if (!findNews) {
      return res.status(404).json({msg: "Gagal menghapus kabar berita"});
    }
    await database.transaction(async (t) => {
      await news.destroy({
        where: {
          id: req.params.id,
          staff_id: idStaff,
        },
        transaction: t,
      });

      await newsReaction.destroy({
        where: {
          news_id: req.params.id,
        },
        transaction: t,
      });
      await newsCommentReaction.destroy({
        where: {
          news_comment_id: findNews?.newsComments?.map((item) => item.id),
        },
        transaction: t,
      });
    });
    if (
      fs.existsSync(
        path.resolve("./Assets/news/thumbnail/" + findNews?.thumbnail)
      )
    ) {
      fs.unlink("./Assets/news/thumbnail/" + findNews?.thumbnail, (error) => {
        if (error) throw error;
      });
    }

    return res.status(201).json({msg: "Berhasil menghapus kabar berita"});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

const newsGetter = async (req, type = "public") => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 40;
  const search = req.query.search || "";
  const offside = limit * page;
  const totalData = await news.count();
  const totalRows = await news.count({
    where: {
      isPublish: 1,
      ...(type === "public" && {isPrivate: 0}),
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
    nest: true,
    where: {
      isPublish: 1,
      ...(type === "public" && {isPrivate: 0}),
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
  return {data, totalData, totalPage, limit, totalRows, page};
};

export const getNews = async (req, res) => {
  try {
    await permissionAccess({
      req,
      res,
      permission: "news",
    });
    const {data, totalData, totalPage, limit, totalRows, page} =
      await newsGetter(req, "private");
    const response = {
      data: data.map((item) => ({
        ...item,
        html: textEllipsis(striptags(item.html), 100),
      })),
      totalPage: totalPage,
      limit: limit,
      totalRows: totalRows,
      totalData,
      page: page + 1,
    };
    res.json(response);
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};
export const getPublicNews = async (req, res) => {
  try {
    const {data, totalData, totalPage, limit, totalRows, page} =
      await newsGetter(req, "public");
    const response = {
      data: data.map((item) => ({
        ...item,
        html: textEllipsis(striptags(item.html), 100),
      })),
      totalPage: totalPage,
      limit: limit,
      totalRows: totalRows,
      totalData,
      page: page + 1,
    };
    res.json(response);
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

export const recomendedNews = async (news_id, type = "public") => {
  const typeOrder = ["DESC", "ASC", "DESC", "ASC"];
  const randomRecomended = [
    ["id", typeOrder[Math.ceil(Math.random() * typeOrder.length - 1)]],
    ["up_vote", typeOrder[Math.ceil(Math.random() * typeOrder.length - 1)]],
    ["down_vote", typeOrder[Math.ceil(Math.random() * typeOrder.length - 1)]],
    ["createdAt", typeOrder[Math.ceil(Math.random() * typeOrder.length - 1)]],
  ];

  let data = await news.findAll({
    raw: true,
    nest: true,
    where: {
      isPublish: 1,
      ...(type === "public" && {isPrivate: 0}),
      ...(news_id && {
        id: {
          [Op.not]: news_id,
        },
      }),
    },
    limit: 4,
    order: [
      randomRecomended[Math.ceil(Math.random() * randomRecomended.length - 1)],
    ],
    include: [{model: stafAuth, attributes: ["nama"]}],
  });

  return data?.map((item) => ({
    ...item,
    html: textEllipsis(striptags(item.html), 50),
  }));
};
export const getRecommendedNews = async (req, res) => {
  try {
    await permissionAccess({
      req,
      res,
      permission: "news",
    });
    const data = await recomendedNews(req.params.id, "all");
    res.json({data});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};
export const getRecomendedPublicNews = async (req, res) => {
  try {
    const data = await recomendedNews(req.params.id, "public");
    res.json({data});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

export const getMyNews = async (req, res) => {
  try {
    await permissionAccess({
      req,
      res,
      permission: "news",
    });
    await permissionAccess({
      req,
      res,
      permission: "cud_news",
    });
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 40;
    const search = req.query.search || "";
    const offside = limit * page;
    const {idStaff} = getUserInfoToken(
      req.headers.authorization.replace("Bearer ", "")
    );
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
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};
export const getMyNewsById = async (req, res) => {
  try {
    await permissionAccess({
      req,
      res,
      permission: "news",
    });
    await permissionAccess({
      req,
      res,
      permission: "cud_news",
    });
    const {idStaff} = getUserInfoToken(
      req.headers.authorization.replace("Bearer ", "")
    );
    let data = await news.findOne({
      where: {
        id: req.params.id,
        staff_id: idStaff,
      },
    });
    if (!data) return res.status(404).json({msg: "Berita tidak ditemukan"});
    res.json({data});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

export const getNewsById = async (req, res) => {
  try {
    await permissionAccess({
      req,
      res,
      permission: "news",
    });
    const {idStaff, idSiswa} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    let data = await news.findOne({
      where: {
        id: req.params.id,
      },
      include: [{model: stafAuth, attributes: ["nama"]}],
    });
    if (!data) return res.status(404).json({msg: "Berita tidak ditemukan"});
    const commentByNews = await newsComment.findOne({
      raw: true,
      nest: true,
      where: {
        news_id: data.id,
        ...(idStaff && {
          staff_id: idStaff,
        }),
        ...(idSiswa && {
          siswa_id: idSiswa,
        }),
      },
      attributes: ["id"],
    });
    const getHistoryNewsResponse = await newsReaction.findOne({
      raw: true,
      nest: true,
      where: {
        news_id: data.id,
        ...(idStaff && {
          staff_id: idStaff,
        }),
        ...(idSiswa && {
          siswa_id: idSiswa,
        }),
      },
    });
    const {siswa_id, staff_id, type_vote} = getHistoryNewsResponse || {};
    const is_already_comment = Boolean(commentByNews);
    const is_reacted =
      (siswa_id || staff_id) === (idSiswa || idStaff) ? type_vote : null;
    res.json({data, is_already_comment, is_reacted});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};
export const getPublicNewsById = async (req, res) => {
  try {
    let data = await news.findOne({
      where: {
        id: req.params.id,
        isPrivate: 0,
        isPublish: 1,
      },
      include: {model: stafAuth, attributes: ["nama"]},
    });

    res.json({data});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

export const reactionNews = async (req, res) => {
  try {
    const {idStaff, idSiswa} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    const {news_id, type_vote} = req.params;
    const enumReaction = {up_vote: "up_vote", down_vote: "down_vote"};
    if (!enumReaction[type_vote])
      return res.status(404).json({msg: "type vote tidak valid"});
    const findNewsComment = await news.findOne({
      where: {
        id: news_id,
      },
    });
    if (!findNewsComment)
      return res.status(404).json({msg: "komentar tidak ditemukan"});

    const findAlreadyVote = await newsReaction.findOne({
      where: {
        news_id,
        ...(idStaff && {
          staff_id: idStaff,
        }),
        ...(idSiswa && {
          siswa_id: idSiswa,
        }),
      },
      attributes: ["type_vote", "id"],
    });
    await database.transaction(async (t) => {
      if (!findAlreadyVote) {
        /// JIKA BELUM VOTE
        await newsReaction.create(
          {
            news_id,
            type_vote,
            ...(idStaff && {
              staff_id: idStaff,
            }),
            ...(idSiswa && {
              siswa_id: idSiswa,
            }),
          },
          {transaction: t}
        );
        await news.increment(enumReaction[type_vote], {
          by: 1,
          where: {
            id: news_id,
          },
          transaction: t,
        });
      } else {
        /// JIKA SUDAH VOTE

        if (findAlreadyVote?.type_vote === enumReaction[type_vote]) {
          await newsReaction.destroy({
            where: {
              id: findAlreadyVote.id,
            },
            transaction: t,
          });
          await news.decrement(enumReaction[type_vote], {
            by: 1,
            where: {
              id: news_id,
            },
            transaction: t,
          });
        } else {
          /// JIKA DARI UP VOTE LANGSUNG KE DOWN VOTE
          /// KURANGI DULU YANG LAMA
          await news.decrement(findAlreadyVote.type_vote, {
            by: 1,
            where: {
              id: news_id,
            },
            transaction: t,
          });
          await newsReaction.update(
            {type_vote},
            {
              where: {
                id: findAlreadyVote.id,
              },
              transaction: t,
            }
          );
          /// TAMBAH YANG LAMA
          await news.increment(enumReaction[type_vote], {
            by: 1,
            where: {
              id: news_id,
            },
            transaction: t,
          });
        }
      }
    });
    return res.status(200).json({msg: "sukses"});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};
