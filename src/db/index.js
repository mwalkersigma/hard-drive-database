const {Pool} = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    application_name:"hdd database",
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
