import * as AWS from "aws-sdk";
import * as bodyParser from "body-parser";
import * as express from "express";
import Router from 'express-promise-router';
import * as multer from "multer";
import 'source-map-support/register';
import { initConnection } from "./Connection";
import { Service } from "./services/Service";
import { ServiceContext } from "./services/ServiceContext";

const app = express();
const router = Router();

AWS.config.loadFromPath('./aws-config.json');

app.use(express.static('public'));

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function init() {
    return await initConnection();
}

init().then(conn => {
    const ctx = new ServiceContext(conn);
    const service = new Service(ctx);

    router.post('/:method', multer().any(), async (req, res) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin);

        // リクエストヘッダーに含まれる全てのヘッダーがないとCORSによりリジェクトされる
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Session');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

        const methodName = req.params.method;
        ctx.setHeaders(req.headers);
        const start = Date.now();
        let response;
        try {
            let body = req.body;
            if (methodName.startsWith("upload")) {
                if (!req.files) {
                    throw "Need file";
                }
                body = [{ blob: req.files[0], ...JSON.parse(body.json) }];
            }
            response = await service.execute(methodName, body);
        } catch (x) {
            console.log(x);
            console.log(x.stack);
            throw x;
        }
        const time = Date.now() - start;

        res.header("Time", time.toString());
        res.status(200).json(response);
    });

    router.options('/:any', async (req, res) => {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Session');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        res.header('Access-Control-Max-Age', '864000');
        res.sendStatus(200);
    });

    app.use(router);

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
});

module.exports = app;