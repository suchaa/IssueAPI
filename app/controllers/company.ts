import { Router, Request, Response } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import * as myConfig from 'config';
import { mongodb } from '../helpers/mongodb';
import * as auth from '../helpers/auth';
import * as async from 'async';
import * as xl from 'excel4node';

let config: any = myConfig.get('Config');

/* Assign router to the express.Router() instance */
const router: Router = Router();

/**
 * authen ทุก url router.use(auth.authenticate());
 */

//router.use(auth.authenticate());

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

router.post('/find', (req: Request, res: Response) => {
    //  let ret = {
    //     rows: [],
    //     total: 0
    // }; 
    let data = req.body;
    async.parallel([
        function (callback) {
            mongodb.collection("company").find(
                {
                    compName: new RegExp(`${data.searchText}`)
                }
            ).skip(data.numPage * data.rowPerPage)
                .limit(data.rowPerPage)
                .toArray().then((rows) => {
                    callback(null, rows);
                });
        },
        function (callback) {
            mongodb.collection("company").find(
                {
                    compName: new RegExp(`${data.searchText}`)
                }
            ).count().then((data) => {
                callback(null, data);
            })
        }
    ],
        function (err, results) {
            let ret = {
                rows: results[0],
                total: results[1]
            };
            res.json(ret);
        });
});

router.get('/excel', (req: Request, res: Response) => {
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet("Reconcile report");
    ws.cell(1,1).string("Reconcile report").style({font: {bold: true}});
    wb.write("test.xlsx", (error, result) => {
        //res.json(result);
        res.download("test.xlsx");
    });
});

export const CompanyController: Router = router;
