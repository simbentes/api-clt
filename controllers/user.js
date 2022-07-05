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
  const { id } = req.params;
  const { firstName, lastName, summary } = req.body;

  const userData = await userModel.findByPk(id, {
    include: [RoleModel],
    attributes: { exclude: ["RoleId"] },
  });

  if (firstName) userData.firstName = firstName;
  if (lastName) userData.lastName = lastName;
  if (summary) userData.summary = summary;

  await userData.save();

  res.json(success(userData));
}

//
//
//
//

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

async function unfollow(req, res) {
  const { user } = req;
  const { id } = req.params;

  const isFollowinguser = await user.getFollowees({
    where: {
      id,
    },
  });

  if (isFollowinguser?.length) {
    const result = await user.removeFollowee(id);
    res.send(
      success(
        {
          success: result,
        },
        {},
        "Success unfollowing"
      )
    );

    return;
  }

  throw new ConflictError("Already unfollowing the user");
}

const userController = {
  get,
  getById,
  update,
  register,
  login,
  auth,
  follow,
  unfollow,
};

module.exports = userController;
