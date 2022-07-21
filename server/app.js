const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./src/config/winston');
const morgan = require('morgan');

const combined =
  ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
const morganFormat = process.env.NODE_ENV !== 'production' ? 'dev' : combined; // NOTE: morgan 출력 형태 server.env에서 NODE_ENV 설정 production : 배포 dev : 개발

const app = express();

app.use(morgan(morganFormat, { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/build')));

// 리액트 파일 제공
app.use('/*', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join('../client/build', 'index.html'));
  }
  next();
});

// 라우팅
const router = require('./src/routes/router');

app.use('/api', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    success: false,
    message: 'Server Error is occured',
    code: 'UnexpectedError',
  });
});

module.exports = app;
