import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { CompanyController } from './controllers/company'; /* เรียก controller company */
import { UserController } from './controllers/user';
import { CustomerController } from './controllers/customer';
import { IssueController } from './controllers/issue';
import { LoginController } from './controllers/login';

/* สร้าง express application instance */
const app: express.Application = express();

/* the port the express app will listen on */
const port: string = process.env.PORT || '4000'; /* set port || default port */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use('/company', CompanyController); /* เรียก controller company */
app.use('/user', UserController);
app.use('/customer', CustomerController);
app.use('/issue', IssueController);
app.use('/login', LoginController);

/* serve the application at the given port */
app.listen(port, () => {
    /* success callback */
    console.log(`Listening at http://localhost:${port}/`);
});

