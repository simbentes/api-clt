const { success } = require("../utils/apiResponse");
const { generateToken } = require("../utils/auth");
const { ConflictError, NotFoundError, UnauthorizedError, BadRequest } = require("../utils/errors");
const { getPaginationProps } = require("../utils/pagination");
const { user } = require("../database");
const db = require("../database");
const bcrypt = require("bcrypt");

async function get(req, res) {
  const { uid } = req;
  try {
    const user_res = await user.getById(uid);

    res.json(success(...user_res));
  } catch (err) {
    throw new NotFoundError("User not found");
  }
}

async function getById(req, res) {
  const { id } = req.params;

  const userData = await userModel.findByPk(id, {
    include: [RoleModel],
    attributes: { exclude: ["password"] },
  });
  if (userData) {
    res.json(success(userData));
  } else {
    throw new NotFoundError("user not found");
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

      res.json(success(user, { token }));
    } else {
      throw new ConflictError("User with that email already exists");
    }
  } catch (err) {
    throw new ConflictError("Duplicate information.");
  }
}

async function update(req, res) {
  const { uid } = req;

  const { firstName, lastName, img, bio, instagram, whatsapp } = req.body;

  try {
    await user.update(firstName, lastName, img, bio, instagram, whatsapp, uid);
    res.json(success());
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
        success(user.uid, {
          token,
        })
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

const userController = {
  get,
  getById,
  update,
  register,
  login,
  auth,
  follow,
  getPub,
};

module.exports = userController;
