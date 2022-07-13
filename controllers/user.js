const { success } = require("../utils/apiResponse");
const { generateToken } = require("../utils/auth");
const { ConflictError, NotFoundError, UnauthorizedError, BadRequest } = require("../utils/errors");
const { getPaginationProps } = require("../utils/pagination");
const { user, pub } = require("../database");
const db = require("../database");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

async function get(req, res) {
  const { uid } = req;
  try {
    const user_res = await user.getById(uid);

    res.json(success(...user_res));
  } catch (err) {
    throw new NotFoundError("User not found");
  }
}

async function register(req, res) {
  const { firstName, lastName, email, password } = req.body;

  try {
    const password_hash = await bcrypt.hash(password, 10);

    const user_res = await user.register(firstName, lastName, email, password_hash);

    console.log("1111::::::", user_res);
    console.log("2222::::::", user_res.status);

    if (user_res.affectedRows === 1) {
      const { insertId: uid } = user_res;

      const token = generateToken(uid);

      res.json(success({ uid: user_res.insertId, avatar: "default.webp", firstName: firstName }, { token }));
    } else {
      throw new ConflictError("User with that email already exists");
    }
  } catch (err) {
    throw new ConflictError("Duplicate information.");
  }
}

async function update(req, res) {
  const { uid } = req;

  let filename = null;

  const { firstName, lastName, bio, instagram, whatsapp } = req.body;

  try {
    cloudinary.config({
      cloud_name: "dtdhjlagx",
      api_key: "381445164451221",
      api_secret: "fUMzRfxXAiiyRBj5QhYzHdjorTQ",
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
      console.log(result, "resultado");
      return result.public_id;
    };

    const fileName = await uploadImage(req.file.path);
    filename = fileName;
    await user.update(firstName, lastName, fileName, bio, instagram, whatsapp, uid);
  } catch (error) {
    console.log(error);
    await user.updateNoFile(firstName, lastName, bio, instagram, whatsapp, uid);
  }

  try {
    res.json(success({ firstName, filename }));
  } catch (err) {
    console.log(err);
    throw new ConflictError("Error.");
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  const users = await user.findByEmail(email);

  if (users.length !== 0) {
    const [user] = users;

    //verificar se a password é igual
    const match = await bcrypt.compare(password, user.password);

    console.log(match);

    if (match) {
      const token = generateToken(user.uid);

      user.password = undefined;

      res.send(
        success(
          { uid: user.uid, avatar: user.avatar, firstName: user.nome },
          {
            token,
          }
        )
      );
    } else {
      throw UnauthorizedError("Invalid credentials");
    }

    return;
  }

  throw BadRequest("Invalid credentials");
}

//
//
//
//

async function auth(req, res) {
  res.send(success(req.user));
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

async function follow(req, res) {
  const { user } = req;
  const { id } = req.params;

  const isFollowinguser = await user.getFollowees({
    where: {
      id,
    },
  });

  if (!isFollowinguser?.length) {
    const result = await user.addFollowee(id);

    res.send(success(result, {}, "Success following"));
    return;
  }

  throw new ConflictError("Already following the user");
}

const getPub = async (req, res) => {
  const { uid } = req;
  const { idUser } = req.params;
  let { lastId = 9999999999, limit = 3 } = req.query;
  lastId = parseInt(lastId);
  limit = parseInt(limit);

  try {
    let resp = await Promise.all([user.getPub(uid, lastId, limit), pub.getEvent_user(uid, lastId, limit)]);

    console.log(resp[0], "INFO PUB");
    console.log(resp[1]), "INFO PUB EVENTO ASSOCIADO";

    let resp_pub = resp[0].map((el) => {
      let evento = resp[1].find((element) => {
        console.log(element.id_pub, ":::///:::///::", el.id_pub);
        return element.id_pub === el.id_pub;
      });

      if (evento != undefined) {
        evento = {
          id: evento.id,
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
        evento: evento ? evento : null,
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

const userController = {
  get,
  update,
  register,
  login,
  auth,
  follow,
  getPub,
};

module.exports = userController;
