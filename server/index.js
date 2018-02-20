var express = require('express')
var router = express.Router()
var db = require('./db')
var init = require('./init')
var arrSort = require('arr-sort');

var mailAddr = process.argv[2];
var mailCode = process.argv[3];

// 发送邮件的node插件
var nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
var poolConfig = {
    pool: true,
    host: 'smtp.163.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: mailAddr,
        pass: mailCode
    }
};
var transporter = nodemailer.createTransport(poolConfig);
// retcode说明:
//     200: 请求成功
//     400: 参数错误
//     410: 未登录
//     420: 用户不存在
// resBody = {
//     retcode: '',
//     retdesc: '',
// }

router.post('/genEmailCode', function(req, res, next) {
    var email = req.body.email,
    resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if(!email){
        resBody = {
            retcode: 400,
            retdesc: '参数错误',
        }
        res.send(resBody)
        return
    }
    function genRandomCode(){
        var arrNum = [];
        for(var i=0; i<6; i++){
            var tmpCode = Math.floor(Math.random() * 9);
            arrNum.push(tmpCode);
        }
        return arrNum.join('')
    }
    db.User.findOne({ email: email }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc && doc.name !== 'tmp') {
            resBody = {
                retcode: 400,
                retdesc: '该邮箱已注册',
            }
            res.send(resBody)
        } else if(!doc){  // 第一次点击获取验证码
            var emailCode = genRandomCode();
            var createdTime = Date.now();
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: '"CMS-of-Blog 👥" <tywei90@163.com>', // sender address
                to: email, // list of receivers
                subject: '亲爱的用户' + email, // Subject line
                text: 'Hello world 🐴', // plaintext body
                html: [
                    '<p>您好！恭喜您注册成为CMS-of-Blog博客用户。</p>',
                    '<p>这是一封发送验证码的注册认证邮件，请复制一下验证码填写到注册页面以完成注册。</p>',
                    '<p>本次验证码为：' + emailCode + '</p>',
                    '<p>上述验证码30分钟内有效。如果验证码失效，请您登录网站<a href="https://cms.wty90.com/#!/register">CMS-of-Blog博客注册</a>重新申请认证。</p>',
                    '<p>感谢您注册成为CMS-of-Blog博客用户！</p><br/>',
                    '<p>CMS-of-Blog开发团队</p>',
                    '<p>'+ (new Date()).toLocaleString() + '</p>'
                ].join('') // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                // console.log('Message sent: ' + info.response);
                new db.User({
                    name: 'tmp',
                    password: '0000',
                    email: email,
                    emailCode: emailCode,
                    createdTime: createdTime,
                    articles: [],
                    links: []
                }).save(function(err) {
                    if (err) return console.log(err)
                    // 半小时内如果不注册成功，则在数据库中删除这条数据，也就是说验证码会失效
                    setTimeout(function(){
                        db.User.findOne({ email: email }, function(err, doc) {
                            if (err) {
                                return console.log(err)
                            } else if (doc && doc.createdTime === createdTime) {
                                db.User.remove({ email: email }, function(err) {
                                    if (err) {
                                        return console.log(err)
                                    }
                                })
                            }
                        })
                    }, 30*60*1000);
                    resBody = {
                        retcode: 200,
                        retdesc: ''
                    }
                    res.send(resBody)
                })
            });
        }else if(doc && doc.name === 'tmp'){ // 在邮箱验证码有效的时间内，再次点击获取验证码
            var emailCode = genRandomCode();
            var createdTime = Date.now();
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: '"CMS-of-Blog 👥" <tywei90@163.com>', // sender address
                to: email, // list of receivers
                subject: '亲爱的用户' + email, // Subject line
                text: 'Hello world 🐴', // plaintext body
                html: [
                    '<p>您好！恭喜您注册成为CMS-of-Blog博客用户。</p>',
                    '<p>这是一封发送验证码的注册认证邮件，请复制一下验证码填写到注册页面以完成注册。</p>',
                    '<p>本次验证码为：' + emailCode + '</p>',
                    '<p>上述验证码30分钟内有效。如果验证码失效，请您登录网站<a href="https://cms.wty90.com/#!/register">CMS-of-Blog博客注册</a>重新申请认证。</p>',
                    '<p>感谢您注册成为CMS-of-Blog博客用户！</p><br/>',
                    '<p>CMS-of-Blog开发团队</p>',
                    '<p>'+ (new Date()).toLocaleString() + '</p>'
                ].join('') // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                db.User.update({ email: email }, { emailCode: emailCode, createdTime: Date.now()}, function(err) {
                    if (err) {
                        return console.log(err)
                    } else {
                        // 半小时内如果不注册成功，则在数据库中删除这条数据，也就是说验证码会失效
                        setTimeout(function(){
                            db.User.findOne({ email: email }, function(err, doc) {
                                if (err) {
                                    return console.log(err)
                                } else if (doc && doc.createdTime === createdTime) {
                                    db.User.remove({ email: email }, function(err) {
                                        if (err) {
                                            return console.log(err)
                                        }
                                    })
                                }
                            })
                        }, 30*60*1000);
                        resBody = {
                            retcode: 200,
                            retdesc: '',
                        }
                        res.send(resBody)
                    }
                })
            });
        }
    })
})

router.get('/latestArticles', function(req, res, next) {
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    db.User.find({}, '-_id name articles', function(err, doc) {
        if (err) {
            return console.log(err)
        }else if(doc){
            var outArr = [];
            for(var i=0, len=doc.length; i<len; i++){
                for(var j=0, len2=doc[i].articles.length; j<len2; j++){
                    outArr.push({
                        title: doc[i].articles[j].title,
                        date: doc[i].articles[j].date,
                        href: '/' + doc[i].name + '#!/article?id=' + doc[i].articles[j]._id
                    })
                }
            }
            outArr.sort(function(a, b){
                return Date.parse(b.date) - Date.parse(a.date)
            })
            outArr = arrSort(outArr,
                [{
                    attr: 'date',
                    asc: function(a, b){return Date.parse(b.date) - Date.parse(a.date)}
                }]
            );
            resBody = {
                retcode: 200,
                retdesc: '请求成功',
                data: {
                    articles: outArr.slice(0, 10)
                }
            }
            res.send(resBody)
        }
    })
})

router.get('/registedUsers', function(req, res, next) {
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    // 过滤掉像tmp这样的临时用户
    db.User.find({name: /^[a-z]{1}[a-z0-9_]{3,15}$/}, '-_id name', function(err, doc) {
        if (err) {
            return console.log(err)
        }else if(doc){
            resBody = {
                retcode: 200,
                retdesc: '请求成功',
                data: {
                    users: doc
                }
            }
            res.send(resBody)
        }
    })
})

router.post('/validateUsername', function(req, res, next) {
    var userName = req.body.userName,
        resBody = {
            retcode: '',
            retdesc: '',
            data: {}
        }
    if (!userName) {
        resBody = {
            retcode: 400,
            retdesc: '参数错误',
        }
        res.send(resBody)
        return
    }
    db.User.count({ name: userName }, function(err, num) {
        if (err) {
            return console.log(err)
        } else {
            if (num === 0) {
                resBody = {
                    retcode: 200,
                    retdesc: '没有同名账号，可以使用注册',
                }
            } else {
                resBody = {
                    retcode: 430,
                    retdesc: '已有同名账号',
                }
            }
            res.send(resBody)
        }
    })
})

router.get('/console/article', function(req, res, next) {
    var id = req.query.id
    var name = req.cookies.username
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            var article = doc.articles.id(id)
            if(article){
                resBody = {
                    retcode: 200,
                    retdesc: '请求成功',
                    data: {
                        article: article
                    }
                }
            }else{
                resBody = {
                    retcode: 430,
                    retdesc: 'id参数错误',
                }
            }
            res.send(resBody)
        }
    })
})

router.post('/common/article', function(req, res, next) {
    var id = req.query.id
    var name = req.body.name
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name || !id) {
        resBody = {
            retcode: 400,
            retdesc: '参数错误',
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            var article = doc.articles.id(id)
            if(article){
                resBody = {
                    retcode: 200,
                    retdesc: '请求成功',
                    data: {
                        article: article
                    }
                }
            }else{
                resBody = {
                    retcode: 430,
                    retdesc: 'id参数错误',
                }
            }
            res.send(resBody)
        }else{
            resBody = {
                retcode: 420,
                retdesc: '用户不存在',
            }
            res.send(resBody)
        }
    })
})

router.post('/common/articleList', function(req, res, next) {
    var name = req.body.name
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 400,
            retdesc: '参数错误',
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            resBody = {
                retcode: 200,
                retdesc: '请求成功',
                data: {
                    articles: doc.articles
                }
            }
            res.send(resBody)
        }else{
            resBody = {
                retcode: 420,
                retdesc: '用户不存在',
            }
            res.send(resBody)
        }
    })
})

router.get('/console/articleList', function(req, res, next) {
    var name = req.cookies.username
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            resBody = {
                retcode: 200,
                retdesc: '请求成功',
                data: {
                    articles: doc.articles
                }
            }
            res.send(resBody)
        }
    })
})

router.post('/login', function(req, res, next) {
    var name = req.body.userName,
        password = req.body.password,
        resBody = {
            retcode: '',
            retdesc: '',
            data: {}
        }
    db.User.findOne({ name: name }, 'password', function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (!doc) {
            resBody = {
                retcode: 420,
                retdesc: '账号或密码错误',
            }
            res.send(resBody)
        } else if (doc.password === password) {
            resBody = {
                retcode: 200,
                retdesc: '登陆成功',
            }
            res.send(resBody)
        } else {
            resBody = {
                retcode: 420,
                retdesc: '账号或密码错误',
            }
            res.send(resBody)
        }
    })
})

router.post('/register', function(req, res, next) {
    var name = req.body.userName,
        password = req.body.password,
        email = req.body.email,
        emailCode = req.body.emailCode,
        resBody = {
            retcode: '',
            retdesc: '',
            data: {}
        }
    // 校验用户名，作为注册以后的用户博客对应的网址路径
    if(!/^[a-z]{1}[a-z0-9_]{3,15}$/.test(name)){
        resBody = {
            retcode: 420,
            retdesc: '用户名格式错误'
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            resBody = {
                retcode: 430,
                retdesc: '账号已存在'
            }
            res.send(resBody)
        } else {
            db.User.findOne({ email: email }, function(err, doc) {
                if (err) {
                    return console.log(err)
                } else if (doc && doc.name !== 'tmp') {
                    resBody = {
                        retcode: 440,
                        retdesc: '该邮箱已注册'
                    }
                    res.send(resBody)
                } else if(doc && doc.name === 'tmp' && doc.emailCode === emailCode){
                    // '设置'的href跟用户名有关, 注意不能直接将init.links赋值给links！
                    var links = JSON.parse(JSON.stringify(init.links))
                    links[1].href = '/' + name + links[1].href
                    db.User.update({ email: email }, { 
                        name: name,
                        password: password,
                        createdTime: Date.now(),
                        articles: init.articles,
                        links: links
                    }, function(err) {
                        if (err) {
                            return console.log(err)
                        } else {
                            resBody = {
                                retcode: 200,
                                retdesc: '注册成功',
                                data: {
                                    userName: name
                                }
                            }
                            res.send(resBody)
                        }
                    })
                }else{
                    resBody = {
                        retcode: 450,
                        retdesc: '验证码错误'
                    }
                    res.send(resBody)
                }
            })
        }
    })
})

router.post('/saveArticle', function(req, res, next) {
    // 获取当前页面地址的path, 防止不同账号登录导致Bug
    var referer = req.headers.referer
    var visitUsername = referer.slice(referer.lastIndexOf('/') + 1)
    var name = req.cookies.username
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
        }
        res.send(resBody)
        return
    }
    if (visitUsername !== name) {
        resBody = {
            retcode: 430,
            retdesc: '非博主不能修改！',
            data:{name}
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            if (req.body.id) {
                var article = doc.articles.id(req.body.id)
                article.title = req.body.title
                article.date = req.body.date
                article.content = req.body.input
            } else {
                var newArticleJSON = {
                    title: req.body.title,
                    date: req.body.date,
                    content: req.body.input
                }
                doc.articles.push(newArticleJSON)
            }
            doc.save(function (err) {
                if (err) return console.log(err)
                resBody = {
                    retcode: 200,
                    retdesc: '保存成功！',
                }
                res.send(resBody)
            })
        }
    })
})

router.post('/common/getLinks', function(req, res, next) {
    // console.log(init.links)
    var name = req.body.name
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 400,
            retdesc: '参数错误',
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            resBody = {
                retcode: 200,
                retdesc: '请求成功',
                data: {
                    links: doc.links
                }
            }
            res.send(resBody)
        }else{
            resBody = {
                retcode: 420,
                retdesc: '用户不存在',
            }
            res.send(resBody)
        }
    })
})

router.get('/console/getLinks', function(req, res, next) {
    var name = req.cookies.username
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            resBody = {
                retcode: 200,
                retdesc: '请求成功',
                data: {
                    links: doc.links
                }
            }
            res.send(resBody)
        }
    })
})

router.post('/setLinks', function(req, res, next) {
    var referer = req.headers.referer
    var visitUsername = referer.slice(referer.lastIndexOf('/') + 1)
    var name = req.cookies.username
    var resBody = {
        retcode: '',
        retdesc: '',
        data: {}
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
        }
        res.send(resBody)
        return
    }
    if (visitUsername !== name) {
        resBody = {
            retcode: 430,
            retdesc: '非博主不能修改！',
            data:{name}
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            doc.links = req.body.links
            doc.save(function(err) {
                if (err) return console.log(err)
                resBody = {
                    retcode: 200,
                    retdesc: '设置成功',
                }
                res.send(resBody)
            })
        }
    })
})

router.post('/savePw', function(req, res, next) {
    var referer = req.headers.referer
    var visitUsername = referer.slice(referer.lastIndexOf('/') + 1)
    var name = req.cookies.username,
        oldPassword = req.body.oldPassword,
        newPassword = req.body.newPassword,
        resBody = {
            retcode: '',
            retdesc: '',
            data: {}
        }
    if(!oldPassword || !newPassword){
        resBody = {
            retcode: 400,
            retdesc: '参数错误',
        }
        res.send(resBody)
        return
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
        }
        res.send(resBody)
        return
    }
    if (visitUsername !== name) {
        resBody = {
            retcode: 430,
            retdesc: '非博主不能修改！',
            data:{name}
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, 'password', function(err, doc) {
        if (err) {
            return console.log(err);
        }
        if (doc.password !== oldPassword) {
            resBody = {
                retcode: 440,
                retdesc: '原密码错误',
            }
            res.send(resBody)
        } else if (newPassword.length < 4) {
            resBody = {
                retcode: 450,
                retdesc: '密码格式错误',
            }
            res.send(resBody)
        }else if(oldPassword === newPassword){
            resBody = {
                retcode: 460,
                retdesc: '不能与原来密码一样',
            }
            res.send(resBody)
        } else {
            db.User.update({ name: name }, { password: newPassword }, function(err) {
                if (err) {
                    return console.log(err)
                } else {
                    resBody = {
                        retcode: 200,
                        retdesc: '修改成功',
                    }
                    res.send(resBody)
                }
            })
        }
    })
})

router.post('/deleteArticle', function(req, res, next) {
    var referer = req.headers.referer
    var visitUsername = referer.slice(referer.lastIndexOf('/') + 1)
    var name = req.cookies.username
    var resBody = {
        retcode: '',
        retdesc: '',
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
        }
        res.send(resBody)
        return
    }
    if (visitUsername !== name) {
        resBody = {
            retcode: 430,
            retdesc: '非博主不能修改！',
            data:{name}
        }
        res.send(resBody)
        return
    }
    db.User.findOne({ name: name }, function(err, doc) {
        if (err) {
            return console.log(err)
        } else if (doc) {
            doc.articles.id(req.body.id).remove()
            doc.save(function(err) {
                if (err) return console.log(err)
                resBody = {
                    retcode: 200,
                    retdesc: '删除成功',
                    data: {}
                }
                res.send(resBody)
            })
        }
    })
})
router.post('/deleteUser', function(req, res, next) {
    var referer = req.headers.referer
    var visitUsername = referer.slice(referer.lastIndexOf('/') + 1)
    var name = req.cookies.username
    var resBody = {
        retcode: '',
        retdesc: '',
    }
    if (!name) {
        resBody = {
            retcode: 410,
            retdesc: '未登录',
        }
        res.send(resBody)
        return
    }
    if (visitUsername !== name) {
        resBody = {
            retcode: 430,
            retdesc: '非博主不能修改！',
            data:{name}
        }
        res.send(resBody)
        return
    }
    db.User.remove({ name: name }, function(err) {
        if (err) {
            return console.log(err)
        } else {
            resBody = {
                retcode: 200,
                retdesc: '注销成功！',
            }
            res.send(resBody)
        }
    })
})

module.exports = router;
