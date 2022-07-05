const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { pub, evento } = require("../database");

const getAll = async (req, res) => {
  const { uid } = req;
  let { lastId = 9999999999, limit = 6 } = req.query;
  lastId = parseInt(lastId);
  limit = parseInt(limit);

  try {
    let resp = await Promise.all([pub.getAll(uid, lastId, limit), pub.getEvent(lastId)]);

    let resp_pub_event = resp[1];

    console.log(resp_pub_event);

    let resp_pub = resp[0].map((el) => {
      let evento = resp[1].find((element) => {
        return element.id_pub === el.id_pub;
      });

      if (evento) {
        evento = {
          id: evento.id_eventos,
          title: evento.nome,
        };
      }

      return {
        id: el.id_pub,
        title: el.title,
        img: el.img,
        user: {
          name: el.name,
          id: el.id_user,
          img: el.foto_perfil,
        },
        time: el.time,
        event: evento ? evento : null,
        like: !el.like ? false : true,
      };
    });

    res.json(
      success(resp_pub, {
        limit,
        lastId: resp_pub[resp_pub.length - 1] && resp_pub[resp_pub.length - 1].id,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const getComments = async (req, res) => {
  const { uid } = req;
  const { idPub } = req.params;

  try {
    const resp = await pub.getComments(uid, idPub);

    console.log(resp);

    const resp_comment = resp.map((el) => {
      return {
        id: el.id_comment,
        comment: el.comment,
        user: {
          name: el.name,
          id: el.id_user,
          img: el.foto_perfil,
        },
        time: el.time,
        like: !el.like ? false : true,
      };
    });

    res.json(success(resp_comment));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const pubController = {
  getAll,
  getComments,
};

module.exports = pubController;