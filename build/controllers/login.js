"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongodb_1 = require("mongodb");
/* Assign router to the express.Router() instance */
var router = express_1.Router();
var mongodb;
exports.LoginController = router;
router.get('/', function (req, res) {
    //let params = JSON.parse(mongodb.req.getBody());
    var data = req.body;
    mongodb.collection("user").find().toArray().then(function (data) {
        res.json(data);
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
//# sourceMappingURL=C:/Users/Administrator/Desktop/Node25-8-17/IssueAPI/controllers/login.js.map