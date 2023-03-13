const express = require('express');
const path = require('path');
require('dotenv').config();
const authMiddleware = require('./middlewares/authMiddleware');
const { error } = require('./utils/apiResponse');

const indexRouter = require('./routes/index');
const memoriaRouter = require('./routes/memoria');
const articleRouter = require('./routes/article');
const userRouter = require('./routes/user');
const eventoRouter = require('./routes/evento');
const pubRouter = require('./routes/pub');
const commentRouter = require('./routes/comment');
const authenticatedMiddleware = require('./middlewares/authenticatedMiddleware');

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use('.netlify/functions/api/img', express.static(__dirname + '/img'));
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(authMiddleware);

app.use('.netlify/functions/api/', indexRouter);
app.use('.netlify/functions/api/memoria', memoriaRouter);
app.use('.netlify/functions/api/article', articleRouter);
app.use('.netlify/functions/api/user', userRouter);
app.use('.netlify/functions/api/evento', eventoRouter);
app.use('.netlify/functions/api/pub', pubRouter);
app.use('.netlify/functions/api/comment', commentRouter);

app.use((err, req, res, next) => {
  if (err && !res.headersSent) {
    res.status(err.statusCode || 500).send(error(err.message, err.statusCode || 500, err.errors));
  }
  next();
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
