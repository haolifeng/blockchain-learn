var express = require('express');
var router = express.Router();
var userModule = require('../db/user');
var Common = require('../lib/common');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register',function(req,res){
    res.render('user/register');
});

router.post('/register',function(req, res){
    var username = req.body.user_name;
    var userpass = req.body.user_pass;

    var cond = {$or: [{userName:username}]};
    userModule.find(cond,function(err, docs){
        if(err){
            return res.json({error: err});
        }
        if(docs.length == 0){
            var _salt = Common.makeSalt(6);
            var data = {
                userName: username,
                passWord:userpass,
                salt:_salt
            };
            userModule.create(data, function(err, user){
                if(err){
                    return res.json({error:err});
                }
                res.json({success:'Resigner Success!'});
            });

        }else {
            //res.json({error: 'Resigner fail, please change username'});
            res.render('/users/list');
        }
    });
});
//看所有的用户
router.get('/list',function(req, res){
    userModule.find(function(err, docs){
        if(err){
            return res.json({error:err});
        }
        if(docs.length == 0) {
            res.send('no users');
        }else{
            var data ={
                docs:docs
            };
            res.render('user/userlist',data);
        }

    });
});

module.exports = router;
