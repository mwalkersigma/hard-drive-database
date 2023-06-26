import {Pool} from "pg";
import * as dotenv from "dotenv";
import Logger from "../modules/logger";
dotenv.config();

// if we are in development mode, use the _dev keys from .env
// otherwise use the prod keys

const pool = new Pool({
    application_name:"hdd database",
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const logger = new Logger();

const db = {
    query(text, params){
        let logString = `Query: ${text} 
        Params: ${params}`
        logger.log(logString);
        return pool.query(text, params);

    },
    logger,
};

export default db;
