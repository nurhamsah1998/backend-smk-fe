import {Op} from "sequelize";
import {
  getUserInfoToken,
  isEmptyString,
} from "../Configuration/supportFunction.js";
import {news} from "../Models/news.js";
import {newsComment} from "../Models/newsComment.js";
import {stafAuth} from "../Models/staf.js";
import {siswaAuth} from "../Models/siswa.js";
import {newsCommentReaction} from "../Models/newsCommentReaction.js";
import database from "../Configuration/database.js";
import {verifyManualToken} from "../middleWare/verifyToken.js";

export const postNewsComment = async (req, res) => {
  try {
    const {idStaff, idSiswa} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    const {text, news_id} = req.body;
    if (isEmptyString(text))
      return res.status(400).json({msg: " komentar tidak boleh kosong!"});
    if (isEmptyString(news_id))
      return res.status(400).json({msg: " news_id tidak boleh kosong!"});

    let newsId = await news.findOne({
      where: {
        id: news_id,
      },
      include: {model: stafAuth, attributes: ["nama"]},
    });
    if (!newsId)
      return res.status(400).json({msg: "news tidak tidak ditemukan!"});

    const isAlreadyComment = await newsComment.findOne({
      where: {
        news_id: newsId.id,
        ...(idStaff && {
          staff_id: idStaff,
        }),
        ...(idSiswa && {
          siswa_id: idSiswa,
        }),
      },
      attributes: ["id"],
    });
    if (isAlreadyComment)
      return res
        .status(400)
        .json({msg: "Kamu sudah berkomentar pada berita ini"});
    await newsComment.create({
      text,
      news_id,
      ...(idStaff && {
        staff_id: idStaff,
      }),
      ...(idSiswa && {
        siswa_id: idSiswa,
      }),
    });
    res.status(201).json({msg: "Berhasil berkomentar"});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
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
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};

export const deleteNewsComment = async (req, res) => {
  try {
    const {idStaff, idSiswa} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    const findNewsComment = await newsComment.findOne({
      where: {
        id: req.params.id,
        ...(idStaff && {
          staff_id: idStaff,
        }),
        ...(idSiswa && {
          siswa_id: idSiswa,
        }),
      },
    });
    if (!findNewsComment) {
      return res.status(404).json({msg: "Gagal menghapus komentar"});
    }
    await database.transaction(async (t) => {
      await newsCommentReaction.destroy({
        where: {
          news_comment_id: req.params.id,
        },
        transaction: t,
      });
      await newsComment.destroy({
        where: {
          id: req.params.id,
          ...(idStaff && {
            staff_id: idStaff,
          }),
          ...(idSiswa && {
            siswa_id: idSiswa,
          }),
        },
        transaction: t,
      });
    });
    res.status(200).json({msg: "Berhasil menghapus komentar"});
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
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
    return res
      .status(error?.status || 500)
      .json({msg: error?.msg || error?.message});
  }
};
export const getCommentByNewsId = async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 40;
  const offside = limit * page;
  try {
    const findCurrentNews = await news.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["staff_id", "isPrivate", "id"],
    });
    if (!findCurrentNews)
      return res.status(404).json({msg: "Komen berita tidak ditemukan"});
    ///
    const token = req.headers.authorization.replace("Bearer ", "");
    const {idStaff, idSiswa} = getUserInfoToken(token) || {};
    if (findCurrentNews.isPrivate) {
      await verifyManualToken(token, res);
    }
    const totalData = await newsComment.count();
    const totalRows = await newsComment.count({
      where: {
        news_id: req.params.id,
      },
    });
    ///
    const totalPage = Math.ceil(totalRows / limit);
    const data = await newsComment.findAll({
      raw: true,
      nest: true,
      where: {
        news_id: req.params.id,
      },
      attributes: ["text", "id", "up_vote", "down_vote", "createdAt"],
      include: [
        {model: siswaAuth, attributes: ["nama", "id"]},
        {model: stafAuth, attributes: ["nama", "id"]},
      ],
      limit: limit,
      offset: offside,
      order: [
        ["createdAt", "DESC"],
        ["up_vote", "DESC"],
      ],
    });
    const getHistoryCommentResponse = await newsCommentReaction.findAll({
      raw: true,
      nest: true,
      where: {
        news_comment_id: {
          [Op.in]: data?.map((item) => item.id),
        },
        ...(idStaff && {
          staff_id: idStaff,
        }),
        ...(idSiswa && {
          siswa_id: idSiswa,
        }),
      },
    });
    const dataRebuild = [];
    for (let x = 0; x < data.length; x++) {
      const elementX = data[x];
      dataRebuild.push(elementX);
      dataRebuild[x]["is_author"] = false;
      dataRebuild[x]["is_reacted"] = null;
      const {siswa, staf} = elementX || {};
      if (findCurrentNews.staff_id === (siswa?.id || staf?.id)) {
        dataRebuild[x]["is_author"] = true;
      }
      for (let y = 0; y < getHistoryCommentResponse.length; y++) {
        const elementY = getHistoryCommentResponse[y];
        const {siswa_id, staff_id, type_vote} = elementY || {};
        if (
          elementX.id === elementY.news_comment_id &&
          (siswa_id || staff_id) === (idSiswa || idStaff)
        ) {
          dataRebuild[x]["is_reacted"] = type_vote;
          break;
        }
      }
    }
    const response = {
      data: dataRebuild,
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

export const reactionComment = async (req, res) => {
  try {
    const {idStaff, idSiswa} =
      getUserInfoToken(req.headers.authorization.replace("Bearer ", "")) || {};
    const {news_comment_id, type_vote} = req.params;
    const enumReaction = {up_vote: "up_vote", down_vote: "down_vote"};
    if (!enumReaction[type_vote])
      return res.status(404).json({msg: "type vote tidak valid"});
    const findNewsComment = await newsComment.findOne({
      where: {
        id: news_comment_id,
      },
    });
    if (!findNewsComment)
      return res.status(404).json({msg: "komentar tidak ditemukan"});

    const findAlreadyVote = await newsCommentReaction.findOne({
      where: {
        news_comment_id: news_comment_id,
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
        await newsCommentReaction.create(
          {
            news_comment_id,
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
        await newsComment.increment(enumReaction[type_vote], {
          by: 1,
          where: {
            id: news_comment_id,
          },
          transaction: t,
        });
      } else {
        /// JIKA SUDAH VOTE

        if (findAlreadyVote?.type_vote === enumReaction[type_vote]) {
          await newsCommentReaction.destroy({
            where: {
              id: findAlreadyVote.id,
            },
            transaction: t,
          });
          await newsComment.decrement(enumReaction[type_vote], {
            by: 1,
            where: {
              id: news_comment_id,
            },
            transaction: t,
          });
        } else {
          /// JIKA DARI UP VOTE LANGSUNG KE DOWN VOTE
          /// KURANGI DULU YANG LAMA
          await newsComment.decrement(findAlreadyVote.type_vote, {
            by: 1,
            where: {
              id: news_comment_id,
            },
            transaction: t,
          });
          await newsCommentReaction.update(
            {type_vote},
            {
              where: {
                id: findAlreadyVote.id,
              },
              transaction: t,
            }
          );
          /// TAMBAH YANG LAMA
          await newsComment.increment(enumReaction[type_vote], {
            by: 1,
            where: {
              id: news_comment_id,
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
