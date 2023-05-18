const {Pool} = require('pg');
const dotenv = require('dotenv');
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



module.exports = {

    query(logger=console.log){
        return (text, params) =>{
            let logString = `
            Query: ${text}
            Params: ${params}
            `
            logger(logString);
            return pool.query(text, params);
        };
    }

};
