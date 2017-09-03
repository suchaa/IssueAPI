"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var myConfig = require("config");
var mongodb_2 = require("../helpers/mongodb");
var multer = require("multer");
var fs = require('fs');
var config = myConfig.get('Config');
/* Assign router to the express.Router() instance */
var router = express_1.Router();
//router.use(auth.authenticate());
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id);
    }
});
var upload = multer({
    storage: storage
});
/* show data */
router.get('/', function (req, res) {
    mongodb_2.mongodb.collection("user").find().toArray().then(function (data) {
        res.json(data);
    });
});
/* show data by id */
router.get('/findById/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("user").findOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
/* add data */
router.post('/', function (req, res) {
    var data = req.body;
    mongodb_2.mongodb.collection("user").insert(data).then(function (data) {
        res.json(data);
    });
});
/* update data */
router.put('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    var data = req.body;
    mongodb_2.mongodb.collection("user").updateOne({ _id: id }, data).then(function (data) {
        res.json(data);
    });
});
/* delete data */
router.delete('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("user").deleteOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
router.post('/search', function (req, res) {
    var ret = {
        rows: [],
        total: 0
    };
    var data = req.body;
    mongodb_2.mongodb.collection("user")
        .find({ firstName: new RegExp("" + data.searchText) })
        .skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray()
        .then(function (rows) {
        ret.rows = rows;
        mongodb_2.mongodb.collection("user")
            .find({ firstName: new RegExp("" + data.searchText) })
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
exports.UserController = router;
//# sourceMappingURL=C:/Users/suchaa/Desktop/Node28-8-17/IssueAPI/controllers/user.js.map