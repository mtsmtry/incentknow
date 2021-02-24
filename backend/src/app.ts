import * as AWS from "aws-sdk";
import * as bodyParser from "body-parser";
import * as express from "express";
import Router from 'express-promise-router';
import { initConnection } from "./Connection";
import { Service } from "./services/Service";
import { ServiceContext } from "./services/ServiceContext";

const app = express();
const router = Router();

AWS.config.loadFromPath('./aws-config.json');

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function init() {
    return await initConnection();
}

init().then(conn => {
    const ctx = new ServiceContext(conn);
    const service = new Service(ctx);

    router.post('/:method', async (req, res) => {
        const methodName = req.params.method;
        ctx.setHeaders(req.headers);
        const start = Date.now();
        const response = await service.execute(methodName, req.body);
        const time = Date.now() - start;
        res.status(200).header("Time", time.toString()).send(JSON.stringify(response)).end();
    });

    app.use(router);

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
})

module.exports = app;