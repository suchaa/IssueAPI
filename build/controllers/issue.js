"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var myConfig = require("config");
var mongodb_2 = require("../helpers/mongodb");
var multer = require("multer");
var fs = require("fs");
var config = myConfig.get('Config');
var mailer = require("nodemailer");
var smtpTransport = mailer.createTransport(config.smtp);
/* Assign router to the express.Router() instance */
var router = express_1.Router();
//router.use(auth.authenticate());
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var folder = config.uploadPath + req.params.folderName; /* folderName ตั้งชื่อไรก็ได้ */
        console.log(folder);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
});
router.get('/', function (req, res) {
    mongodb_2.mongodb.collection("issue").find().toArray().then(function (data) {
        res.json(data);
    });
});
router.get('/findById/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("issue").findOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
/* send mail */
router.post('/', function (req, res) {
    var data = req.body;
    mongodb_2.mongodb.collection("issue").insert(data).then(function (data) {
        res.json(data);
        /*  var mail = {
            to: 'gingsuchada59@gmail.com',
            subject: `Your issue no ${data.no}`,
            html: `<h1>Your issue no ${data.no}</h1>
                    <b>Thank your</b>`
        }
        smtpTransport.sendMail(mail, (error, response) => {
            smtpTransport.close();
            if (error) {
                res.json(error);
            } else {
                res.json(data);
            }
        }); */
    });
});
router.delete('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("issue").deleteOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
router.put('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    var data = req.body;
    mongodb_2.mongodb.collection("issue").updateOne({ _id: id }, data).then(function (data) {
        res.json(data);
    });
});
router.post('/search', function (req, res) {
    var ret = {
        rows: [],
        total: 0
    };
    var data = req.body;
    mongodb_2.mongodb.collection("issue")
        .find({ topic: new RegExp("" + data.searchText) })
        .skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray()
        .then(function (rows) {
        ret.rows = rows;
        mongodb_2.mongodb.collection("issue")
            .find({ topic: new RegExp("" + data.searchText) })
            .count().then(function (data) {
            ret.total = data;
            res.json(ret);
        });
    });
});
router.post('/profile/:id', upload.single('avatar'), function (req, res) {
    console.log(req.body);
    res.json('success');
});
router.get('/profile/:id', function (req, res) {
    fs.readFile("" + config.uploadPath + req.params.id, function (err, data) {
        if (!err) {
            res.write(data);
            res.end();
        }
        else {
            res.end();
        }
    });
});
router.post('/attach/:folderName', upload.single('attach'), function (req, res) {
    res.json({
        success: true
    });
});
router.get('/attach/:folderName', function (req, res) {
    var folder = config.uploadPath + req.params.folderName;
    if (fs.existsSync(folder)) {
        fs.readdir(folder, function (err, files) {
            if (files) {
                res.json(files);
            }
            else {
                res.json([]);
            }
        });
    }
    else {
        res.json([]);
    }
});
router.get('/view-attach/:folderName/:fileName', function (req, res) {
    fs.readFile("" + config.uploadPath + req.params.folderName + "/" + req.params.fileName /*  */, function (err, data) {
        if (!err) {
            res.write(data);
            res.end();
        }
        else {
            res.end();
        }
    });
});
exports.IssueController = router;
//# sourceMappingURL=C:/Users/suchaa/Desktop/Node28-8-17/IssueAPI/controllers/issue.js.map