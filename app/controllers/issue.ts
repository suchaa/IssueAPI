import { Router, Request, Response } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import * as myConfig from 'config';
import { mongodb } from '../helpers/mongodb';
import * as auth from '../helpers/auth';
import * as async from 'async';
import * as multer from 'multer';
import * as fs from 'fs';


let config: any = myConfig.get('Config');

var mailer = require("nodemailer");
var smtpTransport = mailer.createTransport(config.smtp);

/* Assign router to the express.Router() instance */
const router: Router = Router();

//router.use(auth.authenticate());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = config.uploadPath + req.params.folderName; /* folderName ตั้งชื่อไรก็ได้ */
        console.log(folder);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        cb(null, folder);
    }, /* filename ชื่อ file ที่จะเก็บ */
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({
    storage: storage
});

router.get('/', (req: Request, res: Response) => {
    mongodb.collection("issue").find().toArray().then((data) => {
        res.json(data);
    });
});

router.get('/findById/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("issue").findOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

/* send mail */
router.post('/', (req: Request, res: Response) => {
    let data = req.body;

    mongodb.collection("issue").insert(data).then((data) => { /* then คือ สำเร็จ */
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

    router.delete('/:id', (req: Request, res: Response) => {
        let id = new ObjectID(req.params.id);
        mongodb.collection("issue").deleteOne({ _id: id }).then((data) => {
            res.json(data);
        });
    });

    router.put('/:id', (req: Request, res: Response) => {
        let id = new ObjectID(req.params.id);
        let data = req.body;
        mongodb.collection("issue").updateOne({ _id: id }, data).then((data) => {
            res.json(data);
        });
    });

    router.post('/search', (req: Request, res: Response) => {
        let ret = {
            rows: [],
            total: 0
        };
        let data = req.body;
        mongodb.collection("issue")
            .find({ topic: new RegExp(`${data.searchText}`) })
            .skip(data.numPage * data.rowPerPage)
            .limit(data.rowPerPage)
            .toArray()
            .then((rows) => {
                ret.rows = rows;
                mongodb.collection("issue")
                    .find({ topic: new RegExp(`${data.searchText}`) })
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

    router.post('/attach/:folderName', upload.single('attach'), (req: Request, res: Response) => {
        res.json({
            success: true
        })
    });

    router.get('/attach/:folderName', (req: Request, res: Response) => {
        let folder = config.uploadPath + req.params.folderName;
        if (fs.existsSync(folder)) {
            fs.readdir(folder, (err, files) => {
                if (files) {
                    res.json(files);
                } else {
                    res.json([]);
                }

            });
        } else {
            res.json([]);
        }

    });

    router.get('/view-attach/:folderName/:fileName', (req: Request, res: Response) => {
        fs.readFile(
            `${config.uploadPath}${req.params.folderName}/${req.params.fileName}` /*  */
            , (err, data) => {
                if (!err) {
                    res.write(data);
                    res.end();
                } else {
                    res.end();
                }
            });
    });

    export const IssueController: Router = router;