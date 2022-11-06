const { success } = require('../utils/apiResponse');
const { NotFoundError } = require('../utils/errors');
const { pub, evento } = require('../database');
const axios = require('axios').default;
const cloudinary = require('cloudinary').v2;

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
      }),
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
          img: el.img,
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

const like = async (req, res) => {
  const { uid } = req;
  const { idPub } = req.params;
  const { like } = req.query;

  try {
    if (like == 1) {
      const notiToken = await pub.getNotiTokenByPubID(idPub);
      console.log(notiToken);

      // if (notiToken.length > 0) {
      await axios.post('https://exp.host/--/api/v2/push/send', {
        to: 'ExponentPushToken[-p9uevEbBADVo2dNYrxlQr]',
        title: 'Modelo App Cultout',
        body: 'Vítor Silva comentou a tua publicação.',
      });
      // }

      await pub.like(uid, idPub);
    } else {
      await pub.dont_like(uid, idPub);
    }

    res.json(success());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const send = async (req, res) => {
  const { uid } = req;
  let filename = null;
  const { txt, refEvent, image } = req.body;

  try {
    cloudinary.config({
      cloud_name: 'dtdhjlagx',
      api_key: '381445164451221',
      api_secret: 'fUMzRfxXAiiyRBj5QhYzHdjorTQ',
      secure: true,
    });

    const uploadImage = async (imagePath) => {
      // Use the uploaded file's name as the asset's public ID and
      // allow overwriting the asset with new versions
      const options = {
        use_filename: true,
        unique_filename: true,
        overwrite: true,
      };

      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result, 'resultado');
      return result.public_id;

      console.log(filename, filename);
    };

    const fileName = await uploadImage(req.file.path);
    const resp = await pub.send(txt, fileName, uid);

    if (refEvent) await pub.assocEvent(refEvent, resp.insertId);
  } catch (error) {
    console.log(error);
    const resp = await pub.send(txt, filename, uid);

    if (refEvent) await pub.assocEvent(refEvent, resp.insertId);
  }

  try {
    res.json(success());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const eliminar = async (req, res) => {
  const { uid } = req;
  const { idPub } = req.params;
  try {
    await pub.eliminarGostosComentarios(idPub);
  } catch (error) {
    console.log(error);
  }
  try {
    await pub.eliminarComentarios(idPub);
  } catch (error) {
    console.log(error);
  }
  try {
    await pub.eliminarGostos(idPub);
  } catch (error) {
    console.log(error);
  }
  try {
    await pub.eliminarEventosPub(idPub);
  } catch (error) {
    console.log(error);
  }
  try {
    await pub.eliminarPub(idPub);
  } catch (error) {
    console.log(error);
  }

  try {
    res.json(success());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

const pubController = {
  getAll,
  getComments,
  like,
  send,
  eliminar,
};

module.exports = pubController;
