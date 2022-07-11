const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { comment } = require("../database");

const send = async (req, res) => {
  const { uid } = req;
  const { idPub } = req.params;
  const { txt } = req.body;

  try {
    await comment.send(uid, idPub, txt);

    res.json(success());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const like = async (req, res) => {
  const { uid } = req;
  const { idComment } = req.params;
  const { like } = req.query;

  try {
    if (like == 1) {
      await comment.like(uid, idComment);
    } else {
      await comment.dont_like(uid, idComment);
    }

    res.json(success());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const eliminar = async (req, res) => {
  const { uid } = req;
  const { idComment } = req.params;

  try {
    await comment.eliminarGostos(idComment);
    await comment.eliminar(idComment);

    res.json(success());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const commentController = {
  like,
  send,
  eliminar,
};

module.exports = commentController;
