var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', checkNotLogin);
router.get('/', function (req, res) {
    res.render('login', { 'title': '用户登录', 'layout': 'layout' });
});

router.post('/', checkNotLogin);
router.post('/', function (req, res) {
    User.get(req.body.username, function (err, user) {
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }
        if (user.password != req.body.password) {
            req.flash('error', '密码错误');
            return res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/');
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