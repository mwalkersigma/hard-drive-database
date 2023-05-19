import {Pool} from "pg";
import * as dotenv from "dotenv";
import Logger from "../modules/logger";
dotenv.config();

const {
    USER : user,
    PASSWORD:password,
    HOST:host,
    DATABASE:database,
    PORT:port,
    APPLICATION_NAME:application_name
} = process.env;

const pool = new Pool({
    user,
    password,
    host,
    database,
    port,
    application_name,
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
