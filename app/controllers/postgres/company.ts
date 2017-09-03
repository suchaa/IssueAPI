import { Router, Request, Response } from 'express';
import * as pg from 'pg';
import * as postgres from '../../helpers/postgres';

const router: Router = Router();

/**
 * POSTGRES SQL
 */

/* show data */
router.get('/', (req: Request, res: Response) => {
    let data = req.body;
    postgres.doQuery(`
        select * from tb_company 
    `, (error, result) => {
            if (error) {
                res.json(error);
            } else {
                res.json(result.rows)
            }
        });
});

/* insert */
router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    postgres.doQuery(`
        insert into tb_company (comp_code, comp_name)
        values ('${data.compCode}', '${data.compName}')
    `, (error, result) => {
            if (error) {
                res.json(error);
            } else {
                res.json(result.rows)
            }
        });
});

/* delete */
router.delete('/:id', (req: Request, res: Response) => {
    postgres.doQuery(`
        delete from tb_company where comp_code = '${req.params.id}'
    `, (error, result) => {
            if (error) {
                res.json(error);
            } else {
                res.json(result.rows)
            }
        });
});

/* update */
router.put('/:id', (req: Request, res: Response) => {
    let data = req.body;
    postgres.doQuery(`
        UPDATE tb_company
        SET comp_code = '${data.compCode}', comp_name = '${data.compName}'
        WHERE comp_code = '${req.params.id}'
    `, (error, result) => {
            if (error) {
                res.json(error);
            } else {
                res.json(result.rows)
            }
        });
});

router.post('/search', (req: Request, res: Response) => {
    let ret = {
        rows: [],
        total: 0
    };
    let data = req.body;
    postgres.doQuery(`
        SELECT *
        FROM tb_company
        WHERE comp_name LIKE '%${data.searchText}%' 
        offset (${data.numPage * data.rowPerPage})
        limit ${data.rowPerPage}
    `, (error, result) => {
            if (error) {
                res.json(error);
            } else {
                ret.rows = result.rows;
                res.json(ret)
            }
        });
});

export const CompanyController: Router = router;