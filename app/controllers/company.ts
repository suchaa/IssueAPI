import { Router, Request, Response } from 'express';

import { MongoClient, ObjectID } from 'mongodb';

/* Assign router to the express.Router() instance */
const router: Router = Router();
var mongodb;

export const CompanyController: Router = router;

/* req รับมา || res ส่งออกไป */
router.get('/', (req: Request, res: Response) => {
    /* show collection ที่มีใน company */
    mongodb.collection("company").find().toArray().then((data) => {
        res.json(data); /* แสดงข้อมูลแบบ json */
    });
});

router.get('/findById/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("company").findOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

/*  get ดึงข้อมูลมาแสดง
    post เพิ่มข้อมูล
    delete ลบข้อมูล
    put อัพเดตข้อมูล*/

/* รับข้อมูลแบบ json มา , res.json(req.body); แล้วแสดง*/
router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    mongodb.collection("company").insertOne(data).then((data) => { /* then คือ สำเร็จ */
        res.json(data);
    });

    //res.json(req.body); /* แสดงข้อมูลแบบ json ที่หน้าจอ*/
});

router.delete('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("company").deleteOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

router.put('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    let data = req.body;
    mongodb.collection("company").updateOne({ _id: id }, data).then((data) => {
        res.json(data);
    });
});

router.post('/search', (req: Request, res: Response) => {
    let ret = {
        rows: [],
        total: 0
    };
    let data = req.body;
    mongodb.collection("company")
        .find({ compName: new RegExp(`${data.searchText}`) })
        .skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray()
        .then((rows) => {
            ret.rows = rows;
            mongodb.collection("company")
            .find({ compName: new RegExp(`${data.searchText}`) })
                .count().then((data) => {
                    ret.total = data;
                    res.json(ret);
                })
        });
});

/* connect mongodb */
MongoClient.connect(
    "mongodb://localhost:27017/issued", (err, db) => {
        if (err) {
            console.log(err);
        } else {
            mongodb = db;
        }
    });