var express = require('express');
var Fs = require('fs');
var path = require('path');
var multer = require('multer');
var qr = require('qr-image');

var userModule = require('../../db/user');
var cardModule = require('../../db/card');

var Dirs = require('../../lib/Dirs');

var router = express.Router();

var upload = multer({
    dest: 'uploads/',
    fileFilter : function fileFilter(req, file, cb){
        if(file.mimetype.substring(0,'image'.length) == 'image'){
            cb(null, true);
        }else {
            cb(null, false);
        }
    }
});



router.get('/addcard',function(req, res){
    res.render('ntf/addcard')
});
router.post('/addcard',upload.single('card_img'),function(req, res){
    if(req.file) {
        var file = req.file;
        var uploadsDir = '/' + file.destination;
        global.mLogger.debug('uploadsDir is : ' + uploadsDir);
        var baseDir = req.app.locals.__dirname + uploadsDir;
        global.mLogger.debug('baseDir :' + baseDir);
        var ext = file.originalname;
        ext = ext.substring(ext.lastIndexOf('.') + 1);
        var newfile = file.filename + '.' + ext;
        global.mLogger.debug('newfile is : ' + newfile);

        Dirs.getDateDir(baseDir, function (err, path) {
            if (err) return res.send(err);
            var oldfile = baseDir + file.filename;
            global.mLogger.debug('oldfile :' + oldfile);
            global.mLogger.debug('path.fullpath + newfile: ' + newfile);
            Fs.rename(oldfile, path.fullpath + newfile, function(err){
                if (err) return res.send(err);
                global.mLogger.debug(req.body);

                var qrbase = req.app.locals.__dirname + '/qrcodes/';

                Dirs.getDateDir(qrbase,function(err, qrpath){
                    var qrcodeFile = qrpath.fullpath + file.filename + '.png';
                    var qrcodeurlpath = '/qrcodes/' + qrpath.dir + file.filename + '.png';
                    var card = new cardModule();
                    card.card_img = uploadsDir + path.dir + newfile;
                    card.card_id = req.body.card_id;
                    card.card_address = req.body.card_address;
                    card.card_own = req.body.card_own;

                    var qr_svg = qr.image(JSON.stringify(card));
                    qr_svg.pipe(require('fs').createWriteStream(qrcodeFile));
                    card.card_qrcode = qrcodeurlpath;

                    card.save(function (err, doc) {
                        if (err) return res.send(err);
                        res.redirect('./cardlist');
                    });

                });
            });
        });
    }else {
        res.send('card must with picture');
    }
});

router.get('/cardlist',function(req, res){
    cardModule.find(function(err, docs){
        if(err) res.send(err);
        if(docs.length == 0){
            res.send('no card');
        }else{
            var data = {
                docs:docs
            };
            res.render('ntf/cardlist', data);
        }
    });
});

router.get('/carddetails',function(req, res){
    var _id = req.query._id;
    console.log('_id' + _id);
    cardModule.findById(req.query._id,function(err, doc){
        if(err) res.send("no card");
        global.mLogger.debug('doc ' + doc);
        var data = {
            doc: doc
        };
        res.render('ntf/carddetails',data);
    });

});

module.exports = router;