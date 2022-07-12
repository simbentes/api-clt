const pool = require("./connection");
let user = {};

user.register = (nome, apelido, email, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO utilizadores (nome, apelido, email, password, foto_perfil) VALUES (?,?,?,?,'default.webp')`,
      [nome, apelido, email, password],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

user.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT utilizadores.id_utilizadores AS uid, utilizadores.password, utilizadores.nome, utilizadores.foto_perfil AS avatar FROM `utilizadores` WHERE email = ?",
      [email],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

user.getById = (uid) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT id_utilizadores AS uid, nome AS firstName, apelido AS lastName, foto_perfil AS img, biografia AS bio, email, instagram, whatsapp FROM utilizadores WHERE id_utilizadores = ?",
      uid,
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

user.update = (firstName, lastName, img, bio, instagram, whatsapp, uid) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE utilizadores SET nome=?, apelido=?, foto_perfil=?, biografia=?, instagram=?, whatsapp=? WHERE id_utilizadores = ?`,
      [firstName, lastName, img, bio, instagram, whatsapp, uid],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

user.updateNoFile = (firstName, lastName, bio, instagram, whatsapp, uid) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE utilizadores SET nome=?, apelido=?, biografia=?, instagram=?, whatsapp=? WHERE id_utilizadores = ?`,
      [firstName, lastName, bio, instagram, whatsapp, uid],
      (err, rows) => {
        if (err) return reject(err);

        return resolve(rows);
      }
    );
  });
};

user.getPub = (uid, lastId, limit) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id_publicacoes AS id_pub, texto AS title, foto AS img, id_utilizadores AS id_user, CONCAT(utilizadores.nome, ' ', apelido) AS "name", utilizadores.foto_perfil, UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(publicacoes.timestamp) AS time, gostos.ref_id_utilizadores AS "like" FROM publicacoes INNER JOIN utilizadores ON id_utilizadores = ref_id_utilizadores LEFT JOIN pub_associadas_eventos on pub_associadas_eventos.ref_id_publicacoes = id_publicacoes LEFT JOIN seguidores ON seguidores.ref_id_utilizadores_seguir = id_utilizadores AND seguidores.ref_id_utilizadores = ? LEFT JOIN gostos ON gostos.ref_id_publicacoes = id_publicacoes AND gostos.ref_id_utilizadores = ? WHERE utilizadores.id_utilizadores = ? AND id_publicacoes < ? ORDER BY publicacoes.timestamp DESC LIMIT 0, ?`,
      [uid, uid, uid, lastId, limit],
      (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        return resolve(rows);
      }
    );
  });
};

module.exports = user;
