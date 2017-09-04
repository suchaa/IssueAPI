"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var myConfig = require("config");
var mongodb_2 = require("../helpers/mongodb");
var async = require("async");
var xl = require("excel4node");
var config = myConfig.get('Config');
/* Assign router to the express.Router() instance */
var router = express_1.Router();
/**
 * authen ทุก url router.use(auth.authenticate());
 */
//router.use(auth.authenticate());
/* req รับมา || res ส่งออกไป */
router.get('/', function (req, res) {
    /* show collection ที่มีใน company */
    mongodb_2.mongodb.collection("company").find().toArray().then(function (data) {
        res.json(data); /* แสดงข้อมูลแบบ json */
    });
});
router.get('/findById/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("company").findOne({ _id: id }).then(function (data) {
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
    mongodb_2.mongodb.collection("company").insertOne(data).then(function (data) {
        res.json(data);
    });
    //res.json(req.body); /* แสดงข้อมูลแบบ json ที่หน้าจอ*/
});
router.delete('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("company").deleteOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
router.put('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    var data = req.body;
    mongodb_2.mongodb.collection("company").updateOne({ _id: id }, data).then(function (data) {
        res.json(data);
    });
});
router.post('/search', function (req, res) {
    var ret = {
        rows: [],
        total: 0
    };
    var data = req.body;
    mongodb_2.mongodb.collection("company")
        .find({ compName: new RegExp("" + data.searchText) })
        .skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray()
        .then(function (rows) {
        ret.rows = rows;
        mongodb_2.mongodb.collection("company")
            .find({ compName: new RegExp("" + data.searchText) })
            .count().then(function (data) {
            ret.total = data;
            res.json(ret);
        });
    });
});
router.post('/find', function (req, res) {
    //  let ret = {
    //     rows: [],
    //     total: 0
    // }; 
    var data = req.body;
    async.parallel([
        function (callback) {
            mongodb_2.mongodb.collection("company").find({
                compName: new RegExp("" + data.searchText)
            }).skip(data.numPage * data.rowPerPage)
                .limit(data.rowPerPage)
                .toArray().then(function (rows) {
                callback(null, rows);
            });
        },
        function (callback) {
            mongodb_2.mongodb.collection("company").find({
                compName: new RegExp("" + data.searchText)
            }).count().then(function (data) {
                callback(null, data);
            });
        }
    ], function (err, results) {
        var ret = {
            rows: results[0],
            total: results[1]
        };
        res.json(ret);
    });
});
router.get('/excel', function (req, res) {
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet("Reconcile report");
    ws.cell(1, 1).string("Reconcile report").style({ font: { bold: true } });
    wb.write("test.xlsx", function (error, result) {
        //res.json(result);
        res.download("test.xlsx");
    });
});
exports.CompanyController = router;
//# sourceMappingURL=D:/Node/IssueAPI/controllers/company.js.map