const { success } = require("../utils/apiResponse");
const { generateToken } = require("../utils/auth");
const { ConflictError, NotFoundError, UnauthorizedError, BadRequest } = require("../utils/errors");
const { getPaginationProps } = require("../utils/pagination");
const { user } = require("../database");

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

async function getAll(req, res) {
  const { user } = req;
  const excludeFields = ["password"];

  if (!user) excludeFields.push("email");

  const paginationProps = getPaginationProps(req.query, "firstName", "firstName");

  const { count, rows } = await userModel.findAndCountAll({
    attributes: { exclude: excludeFields },
    ...paginationProps,
  });

  res.json(success(rows, { total: count, ...paginationProps }));
}

async function register(req, res) {
  const { firstName, lastName, username, email, password } = req.body;

  const user_res = await user.register(firstName, lastName, username, email, password);

  console.log(user_res);

  if (user_res.status === 200) {
    user.password = undefined;
    const token = generateToken(user);

    res.json(success(user, { token }));
  } else {
    throw new ConflictError("User with that email already exists");
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

async function destroy(req, res) {
  const { id } = req.params;

  const userData = await userModel.findByPk(id, {
    include: [RoleModel],
  });

  if (!userData) {
    throw new NotFoundError("user not found");
  }

  await userModel.destroy({
    where: {
      id,
    },
  });

  res.json(success(userData, {}, "Successfully removed user"));
}

async function login(req, res) {
  const { email, password } = req.body;

  const users = await userModel.findAll({
    where: {
      email,
    },
  });

  if (users.length !== 0) {
    const [user] = users;

    const match = await user.validatePassword(password);

    if (match) {
      const token = generateToken(user);

      user.password = undefined;

      res.send(
        success(user, {
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

async function auth(req, res) {
  res.send(success(req.user));
}

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

async function getFollowers(req, res) {
  const { id } = req.params;

  const paginationProps = getPaginationProps(req.query, "firstName", "firstName");

  const userData = await userModel.findByPk(id);

  if (userData) {
    const data = await userData.getFollowers({
      ...paginationProps,
      attributes: { exclude: ["password"] },
    });
    const count = await userData.countFollowers();

    res.send(
      success(data, {
        total: count,
        ...paginationProps,
      })
    );
  } else {
    throw new NotFoundError("user not found");
  }
}

async function getFollowees(req, res) {
  const { id } = req.params;

  const paginationProps = getPaginationProps(req.query, "firstName", "firstName");

  const userData = await userModel.findByPk(id);

  if (userData) {
    const data = await userData.getFollowees({
      ...paginationProps,
      attributes: { exclude: ["password"] },
    });
    const count = await userData.countFollowees();

    res.send(
      success(data, {
        total: count,
        ...paginationProps,
      })
    );
  } else {
    throw new NotFoundError("user not found");
  }
}

const userController = {
  getById,
  getAll,
  update,
  destroy,
  register,
  login,
  auth,
  follow,
  unfollow,
  getFollowers,
  getFollowees,
};

module.exports = userController;
