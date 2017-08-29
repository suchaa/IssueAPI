import { Router, Request, Response } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import * as myConfig from 'config';
import { mongodb } from '../helpers/mongodb';
import * as multer from 'multer';
var fs = require('fs');

let config = myConfig.get('Config');

/* Assign router to the express.Router() instance */
const router: Router = Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id);
    }
})

var upload = multer({ 
  storage: storage
});


/* show data */
router.get('/', (req: Request, res: Response) => {
    mongodb.collection("user").find().toArray().then((data) => {
        res.json(data); 
    });
});

/* show data by id */
router.get('/findById/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("user").findOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

/* add data */
router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    mongodb.collection("user").insertOne(data).then((data) => { 
        res.json(data);
    });
});

/* update data */
router.put('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    let data = req.body;
    mongodb.collection("user").updateOne({ _id: id }, data).then((data) => {
        res.json(data);
    });
});

/* delete data */
router.delete('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("user").deleteOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

router.post('/search', (req: Request, res: Response) => {
    let ret = {
        rows: [],
        total: 0
    };
    let data = req.body;
    mongodb.collection("user")
        .find({ firstName: new RegExp(`${data.searchText}`) })
        .skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray()
        .then((rows) => {
            ret.rows = rows;
            mongodb.collection("user")
            .find({ firstName: new RegExp(`${data.searchText}`) })
                .count().then((data) => {
                    ret.total = data;
                    res.json(ret);
                })
        });
});

router.post('/profile/:id', upload.single('avatar'), (req: Request, res: Response) => {
    console.log(req.body);
    res.json('success');
});

router.get('/profile/:id', (req: Request, res: Response) => {
    fs.readFile(`${config.uploadPath}${req.params.id}`, (err, data) => {
        if (!err) {
            res.write(data);
            res.end();
        } else {
            res.end();
        }
    });
});
export const UserController: Router = router;
/* connect mongodb */
// MongoClient.connect(
//     "mongodb://localhost:27017/issued", (err, db) => {
//         if (err) {
//             console.log(err);
//         } else {
//             mongodb = db;
//         }
//     });