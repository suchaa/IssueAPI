import { Router, Request, Response } from 'express';

import { MongoClient, ObjectID } from 'mongodb';

/* Assign router to the express.Router() instance */
const router: Router = Router();
var mongodb;

export const LoginController: Router = router;

router.get('/', (req: Request, res: Response) => {
    //let params = JSON.parse(mongodb.req.getBody());
    let data = req.body;
    mongodb.collection("user").find().toArray().then((data) => {
        res.json(data); 
        
        
        
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