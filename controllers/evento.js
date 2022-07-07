const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { evento, pub } = require("../database");

const getAll = async (req, res) => {
  let { page = 0, limit = 4 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const offset = +page * +limit;
  // page 0, limit 10 = start 0, end 10
  // page 1, limit 10 = start 10, end 20

  try {
    let res_evento = await evento.getAll(page, limit);
    res.json(
      success(res_evento, {
        limit,
        currentPage: page,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const getSaved = async (req, res) => {
  const { uid } = req;
  let { page = 0, limit = 4 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const offset = +page * +limit;
  // page 0, limit 10 = start 0, end 10
  // page 1, limit 10 = start 10, end 20

  try {
    let res_evento = await evento.getSaved(uid);
    res.json(
      success(res_evento, {
        limit,
        currentPage: page,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const getEvento = async (req, res) => {
  const { uid } = req;
  const { idEvento } = req.params;

  try {
    let res_evento = await Promise.all([evento.getevento(uid, idEvento), evento.getDatasEvento(idEvento)], evento.getVou(idEvento));

    //count vou
    console.log(res_evento[2]);

    let obj_evento = {
      ...res_evento[0][0],
      datas_evento: res_evento[1],
    };

    res.json(
      success(obj_evento, {
        limit: 1,
        currentPage: 0,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const getPub = async (req, res) => {
  const { uid } = req;
  const { idEvento } = req.params;
  let { lastId = 9999999999, limit = 3 } = req.query;
  lastId = parseInt(lastId);
  limit = parseInt(limit);

  try {
    let resp = await Promise.all([evento.getPub(uid, idEvento, lastId, limit), pub.getEvent_event(idEvento, lastId, limit)]);

    let resp_pub_event = resp[1];

    console.log("JKANDSSJAJKNDKJADSKSDJNKNKJ::::::::::: ", resp_pub_event);

    let resp_pub = resp[0].map((el) => {
      let evento = resp[1].find((element) => {
        console.log(element.id_pub, ":::///:::///::", el.id_pub);
        return element.id_pub === el.id_pub;
      });

      if (evento != undefined) {
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

const EventoController = {
  getAll,
  getEvento,
  getSaved,
  getPub,
};

module.exports = EventoController;
