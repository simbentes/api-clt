const pool = require("../database/connection");
let evento = {};

evento.getAll = (page, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.id_eventos AS id_evento, eventos.nome AS name, eventos.descricao_curta AS "desc", fotos_eventos.foto AS "img", DATE(data_eventos.data) AS "date" FROM eventos INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND data_eventos.data > NOW() AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos GROUP BY data_eventos.ref_id_eventos) ORDER BY data_eventos.data DESC LIMIT ?, ?;`,
      [page, limit],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

evento.getevento = (uid, id_evento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT eventos.nome, eventos.link_reserva, eventos.link_bilheteira, fotos_eventos.foto AS img, eventos.descricao_curta,  eventos.descricao, ficha_tecnica, lotacao, ref_id_tipo_preco, preco_desconto, preco_normal, tipo_eventos.nome, artistas.nome, artistas.id_artistas, guardados_vou.guardados AS guardado, guardados_vou.vou AS vou, duracao, classificacao_etaria FROM eventos LEFT JOIN guardados_vou ON guardados_vou.ref_id_eventos = eventos.id_eventos AND ref_id_utilizadores = ? INNER JOIN data_eventos ON data_eventos.ref_id_eventos = eventos.id_eventos LEFT JOIN fotos_eventos ON fotos_eventos.ref_id_eventos = eventos.id_eventos INNER JOIN tipo_eventos ON tipo_eventos.id_tipo_eventos = eventos.ref_id_tipo_eventos INNER JOIN artistas ON artistas.id_artistas = eventos.ref_id_artistas WHERE (fotos_eventos.foto IS NUll OR fotos_eventos.capa = 1) AND (data_eventos.data) IN (SELECT MIN(data_eventos.data) FROM data_eventos WHERE data_eventos.data > NOW() AND id_eventos = ? GROUP BY data_eventos.ref_id_eventos);`,
      [uid, id_evento],
      (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        return resolve(rows);
      }
    );
  });
};

evento.getDatasEvento = (id_evento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT data_eventos.data FROM data_eventos INNER JOIN eventos ON eventos.id_eventos = data_eventos.ref_id_eventos WHERE eventos.id_eventos = ? ORDER BY data_eventos.data ASC`,
      [id_evento],
      (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        return resolve(rows);
      }
    );
  });
};

evento.getVou = (id_evento) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT COUNT(vou) as count_vou FROM guardados_vou WHERE vou = 1 AND guardados_vou.ref_id_eventos = ?`,
      [id_evento],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

module.exports = evento;
