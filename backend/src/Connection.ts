import { createConnection } from "typeorm";

export async function initConnection() {
    const env = process.env.ENV_SETTINGS;
    if (!env) {
        throw "ENV_SETTINGS is undefined";
    }
    const connectOption = require(`../../ormconfig.${env}.json`);
    while (true) {
        try {
            return await createConnection(connectOption);
        } catch (ex) {
            console.log(ex);
            const error = ex.toString() as string;
            if (!error.includes("Communications link failure")) {
                throw ex;
            }
        }
    }
}