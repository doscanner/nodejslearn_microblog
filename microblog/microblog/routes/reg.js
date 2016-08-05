var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res) {
    res.render('reg', { 'title': '用户注册', 'layout': 'layout' });
});

router.post("/", checkNotLogin);
router.post('/', function (req, res) {
    var name = req.body.username;
    var pwd = req.body.password;
    var pwd2 = req.body.password_confirm;
    if (pwd != pwd2) {
        req.flash('error', '两次输入的密码不一致');
        return res.redirect('/reg');
    }
    var newUser = new User({
        name: name,
        password: pwd
    });
    User.get(newUser.name, function (err, user) {
        if (user)
            err = '用户名已经存在';
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
        //如果不存在则新增用户
        newUser.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', '注册成功');
            res.redirect('/');
        });
    });
});
function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '用户已经登录');
        return res.redirect('/blog');
    }
    next();
}
module.exports = router;