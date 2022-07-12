const { success, error } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { article, pub, evento, memoria } = require("../database");

const pubAleatoria = () => {
  let arraypubs = [];

  if (Math.floor(Math.random() * 2 + 2) == 3) {
    arraypubs.push(false);
  } else {
    arraypubs.push(true);
  }

  if (arraypubs[0] == false) {
    let nAleatorio = Math.random();

    // memoria ou pub
    // existe 50% de probabilidade de calhar uma memória ou evento, depois
    if (nAleatorio > 0.5) {
      arraypubs.push(true);
      arraypubs.push(false);
    } else {
      arraypubs.push(false);
      arraypubs.push(true);
    }
  } else {
    arraypubs.push(false);
    arraypubs.push(false);
  }

  return arraypubs;
};

const getAll = async (req, res) => {
  const { uid } = req;
  let { lastId = 9999999999 } = req.query;
  lastId = parseInt(lastId);
  let limit = 0;

  try {
    let config = pubAleatoria();

    if (config[0]) {
      limit = 4;
    } else {
      limit = 3;
    }

    let resp_pub = await Promise.all([pub.getAll(uid, lastId, limit), pub.getEvent(lastId), evento.selectEventos()]);

    let resp_pub_valid = resp_pub[0].map((el) => {
      let evento = resp_pub[1].find((element) => {
        return element.id_pub === el.id_pub;
      });

      if (evento) {
        if (resp_pub[2].some((e) => e.id_eventos == evento.id_eventos)) {
          evento = {
            id: evento.id_eventos,
            title: evento.nome,
            type: "event",
          };
        } else {
          evento = {
            id: evento.id_eventos,
            title: evento.nome,
            type: "memory",
          };
        }
      }

      return {
        type: "pub",
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

    let resp_evento_valid;
    let resp_memoria_valid;

    if (config[1]) {
      const resp_evento = await evento.getRandom();
      const { id } = resp_evento[0];
      const resp_data_vou = await evento.getVou(id);

      resp_evento_valid = {
        type: "event",
        ...resp_evento["0"],
        ...resp_data_vou["0"],
      };
    }

    if (config[2]) {
      const resp_memoria = await memoria.getRandom();
      resp_memoria_valid = {
        type: "memory",
        ...resp_memoria["0"],
      };
      console.log(resp_memoria, "resp memoria");
    }

    let res_article = [...resp_pub_valid];
    if (!config[0]) {
      res_article = [...resp_pub_valid, resp_evento_valid || resp_memoria_valid];
    }

    let lastIdSend = resp_pub_valid[resp_pub_valid.length - 1] && resp_pub_valid[resp_pub_valid.length - 1].id;

    if (!lastIdSend) {
      lastIdSend = 0;
    }

    res.json(
      success(res_article, {
        limit,
        lastId: lastIdSend,
      })
    );
  } catch (err) {
    console.log(err);
    res.json(error());
  }
};

const ArticleController = {
  getAll,
};

module.exports = ArticleController;
