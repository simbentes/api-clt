const memoriaController = require('./memoria');
const articleController = require('./article');
const userController = require('./user');
const eventoController = require('./evento');
const pubController = require('./pub');
const commentController = require('./comment');

const Controllers = {
  memoriaController,
  articleController,
  userController,
  eventoController,
  pubController,
  commentController,
};

module.exports = Controllers;
