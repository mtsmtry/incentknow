import { AssertionError } from "assert";
import * as express from "express";
import * as bodyParser from "body-parser";
import Router from 'express-promise-router';
import { ServiceUser } from "./service_user";
import { ServiceSpace } from "./service_space";
import { ServiceFormat } from "./service_format";
import { ServiceContainer } from "./service_container";
import { UtilsBase } from "./utils_base";
import * as AWS from "aws-sdk";

const app = express();
const router = Router();

AWS.config.loadFromPath('./aws-config.json');

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function getMethod(name: string) {
    return ServiceUser[name] || ServiceSpace[name] || ServiceFormat[name] || ServiceContainer[name];
}

router.post('/:method', async (req, res) => {
    const method = req.params.method;
    //console.log("post: " + method);
    //console.log(req.body);
    UtilsBase.userId = "e7st6GlawfJu"; // req.headers["session"]?.toString();
    const start = Date.now();
    const response = await getMethod(method)(req.body);
    const time = Date.now() - start;
    res.status(200).header("Time", time.toString()).send(JSON.stringify(response)).end();
});

router.get('/_ah/warmup', async (req, res) => {
    console.log('Walmup!');　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
    res.status(200).send("Walmup!").end();
});

app.use(router);

UtilsBase.init().then(() => {

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
});

module.exports = app;