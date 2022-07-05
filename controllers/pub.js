const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { pub, evento } = require("../database");

const getAll = async (req, res) => {
  let { lastId = 9999999999, limit = 4 } = req.query;
  lastId = parseInt(lastId);
  limit = parseInt(limit);

  try {
    let resp = await Promise.all([pub.getAll(lastId, limit), pub.getEvent(lastId, limit)]);
    //let res = [pub.getAll(lastId, limit), pub.getEvent(lastId, limit), pub.getComments(lastId, limit)];

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
        lastId: lastId,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const pubController = {
  getAll,
};

module.exports = pubController;
