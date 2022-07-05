const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { pub, evento } = require("../database");

const getAll = async (req, res) => {
  let { lastId = 0, limit = 4 } = req.query;
  lastId = parseInt(lastId);
  limit = parseInt(limit);

  try {
    let resp = await Promise.all([pub.getAll(lastId, limit)]);
    //let res = [pub.getAll(lastId, limit), pub.getEvent(lastId, limit), pub.getComments(lastId, limit)];

    console.log(resp);

    let resp_pub = resp[0].map((el) => {
      return {
        id: el.id_pub,
        title: el.title,
        img: el.img,
        user: {
          name: el.name,
          id: el.id_user,
          img: el.foto_perfil,
        },
        event: null,
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
