var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

var indexRouter = require('./routes/index');

var webhooksRouter = require('./routes/webhooks');
var adminRouter = require('./routes/admin');
let controllerRouter = require('./routes/controller');

global.__basedir = __dirname;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "VSW Repo Controller API",
      version: "0.0.1"
    }
  },
  apis: ['./routes/admin.js', './routes/controller.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/webhooks', webhooksRouter);
app.use('/admin', adminRouter);
app.use('/controller', controllerRouter);
app.use('/apiDoc', swaggerUI.serve, swaggerUI.setup(swaggerDocs, { explorer: true }));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
