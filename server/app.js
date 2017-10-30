var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./index');
var db = require('./db')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, '../public')));

// 公共ajax接口(index.js)
app.use('/web', routes);

// 公共html页面，比如登录页，注册页
app.get('/', function(req, res, next) {
    res.render('common', { title: 'CMS-blog' });
})

// 跟用户相关的博客页面(路由的第一个参数只匹配与处理的相关的，不越权！)
app.get(/^\/[a-z]{1}[a-z0-9_]{3,15}$/, function(req, res, next) {
    // format获取请求的path参数
    var pathPara = req._parsedUrl.pathname.slice(1).toLocaleLowerCase()
    // 查询是否对应有相应的username
    db.User.count({name: pathPara}, function(err, num) {
        if (err) return console.log(err)
        if(num > 0){
            res.render('main', { title: 'CMS-blog' });
        }else{
            // 自定义错误处理
            res.status(403);
            res.render('error', {
                message: '该用户尚未开通博客。<a href="/#!/register">去注册</a>',
            });
        }
    })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;
