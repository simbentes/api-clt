const { success } = require("../utils/apiResponse");
const { NotFoundError } = require("../utils/errors");
const { evento, pub } = require("../database");

const getAll = async (req, res) => {
  let { tipo } = req.query;
  tipo = parseInt(tipo);

  try {
    let res_evento = await evento.getByType(tipo);
    res.json(success(res_evento));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const getSaved = async (req, res) => {
  const { uid } = req;

  try {
    let res_evento = await evento.getSaved(uid);
    res.json(success(res_evento));
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
      nome: res_evento[0][0].nome,
      link_reserva: res_evento[0][0].link_reserva,
      link_bilheteira: res_evento[0][0].link_bilheteira,
      img: res_evento[0][0].img,
      descricao_curta: res_evento[0][0].descricao_curta,
      descricao: res_evento[0][0].descricao,
      ficha_tecnica: res_evento[0][0].ficha_tecnica,
      lotacao: res_evento[0][0].lotacao,
      ref_id_tipo_preco: res_evento[0][0].ref_id_tipo_preco,
      preco_desconto: res_evento[0][0].preco_desconto,
      preco_normal: res_evento.preco_normal,
      id_artistas: res_evento[0][0].id_artistas,
      guardado: res_evento[0][0].guardado ? true : false,
      vou: res_evento[0][0].vou ? true : false,
      duracao: res_evento[0][0].duracao,
      classificacao_etaria: res_evento[0][0].classificacao_etaria,
      datas_evento: res_evento[1],
      num_vou: res_evento[2] || 0,
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

const action = async (req, res) => {
  const { uid } = req;
  const { idEvento } = req.params;
  let { vou, guardar } = req.query;
  try {
    const isSetVouGuardar = await evento.getVouGuardar(uid, idEvento);

    //update
    if (isSetVouGuardar.length > 0) {
      if (vou) {
        vou = parseInt(vou);
        if (vou === 0 || vou === 1) await evento.updateVou(uid, idEvento, vou);
      }

      if (guardar) {
        guardar = parseInt(guardar);
        console.log(guardar, "GUARDAR");
        if (guardar === 0 || guardar === 1) await evento.updateGuardar(uid, idEvento, guardar);
      }
      //insert
    } else {
      if (vou) {
        vou = parseInt(vou);
        if (vou === 0 || vou === 1) await evento.setVou(uid, idEvento, vou);
      }

      if (guardar) {
        guardar = parseInt(guardar);

        console.log(guardar, "GUARDAR");
        if (guardar === 0 || guardar === 1) await evento.setGuardar(uid, idEvento, guardar);
      }
    }

    res.json(success());
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
  action,
};

module.exports = EventoController;
