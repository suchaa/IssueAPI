"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongodb_1 = require("mongodb");
/* Assign router to the express.Router() instance */
var router = express_1.Router();
var mongodb;
exports.IssueController = router;
router.get('/', function (req, res) {
    mongodb.collection("issue").find().toArray().then(function (data) {
        res.json(data);
    });
});
router.get('/findById/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb.collection("issue").findOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
router.post('/', function (req, res) {
    var data = req.body;
    mongodb.collection("issue").insertOne(data).then(function (data) {
        res.json(data);
    });
});
router.delete('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb.collection("issue").deleteOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
router.put('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    var data = req.body;
    mongodb.collection("issue").updateOne({ _id: id }, data).then(function (data) {
        res.json(data);
    });
});
router.post('/search', function (req, res) {
    var ret = {
        rows: [],
        total: 0
    };
    var data = req.body;
    mongodb.collection("issue")
        .find({ email: new RegExp("" + data.searchText) })
        .skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray()
        .then(function (rows) {
        ret.rows = rows;
        mongodb.collection("issue")
            .find({ email: new RegExp("" + data.searchText) })
            .count().then(function (data) {
            ret.total = data;
            res.json(ret);
        });
    });
});
/* connect mongodb */
mongodb_1.MongoClient.connect("mongodb://localhost:27017/issued", function (err, db) {
    if (err) {
        console.log(err);
    }
    else {
        mongodb = db;
    }
});
//# sourceMappingURL=C:/Users/suchaa/Desktop/Node28-8-17/IssueAPI/controllers/issue.js.map