const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { comment } = require("../database");

const like = async (req, res) => {
  const { uid } = req;
  const { idComment } = req.params;
  const { like } = req.query;

  try {
    let resp = {};
    if (like == 0) {
      resp = await comment.like(uid, idComment);
    } else {
      resp = await comment.dont_like(uid, idComment);
    }

    res.json(success());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const commentController = {
  like,
};

module.exports = commentController;
