"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongodb_1 = require("mongodb");
/* Assign router to the express.Router() instance */
var router = express_1.Router();
var mongodb;
exports.CompanyController = router;
/* req รับมา || res ส่งออกไป */
router.get('/', function (req, res) {
    /* show collection ที่มีใน company */
    mongodb.collection("company").find().toArray().then(function (data) {
        res.json(data); /* แสดงข้อมูลแบบ json */
    });
});
router.get('/findById/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb.collection("company").findOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
/*  get ดึงข้อมูลมาแสดง
    post เพิ่มข้อมูล
    delete ลบข้อมูล
    put อัพเดตข้อมูล*/
/* รับข้อมูลแบบ json มา , res.json(req.body); แล้วแสดง*/
router.post('/', function (req, res) {
    var data = req.body;
    mongodb.collection("company").insertOne(data).then(function (data) {
        res.json(data);
    });
    //res.json(req.body); /* แสดงข้อมูลแบบ json ที่หน้าจอ*/
});
router.delete('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb.collection("company").deleteOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
router.put('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    var data = req.body;
    mongodb.collection("company").updateOne({ _id: id }, data).then(function (data) {
        res.json(data);
    });
});
router.post('/search', function (req, res) {
    var ret = {
        rows: [],
        total: 0
    };
    var data = req.body;
    mongodb.collection("company")
        .find({ compName: new RegExp("" + data.searchText) })
        .skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray()
        .then(function (rows) {
        ret.rows = rows;
        mongodb.collection("company")
            .find({ compName: new RegExp("" + data.searchText) })
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
//# sourceMappingURL=C:/Users/Administrator/Desktop/Node25-8-17/IssueAPI/controllers/company.js.map