import db from "../../db";
import buildHardDriveQuery from "../insertQueryBuilder/buildHardDriveQuery";

export default function handleSingleReport (parsedFile:any) {
    const logger = db.logger;
    const {log} = logger;
    console.log("here")
    // this returns a [string,string[]] and a callback function
    // the call back function takes the report_id and the db pool
    // and executes the subqueries
    // which add the data for the report to the database
    let hardDriveQueryParameters = buildHardDriveQuery(parsedFile.report) as [[string,any[]], (report_id: any, pool: any, log: (message:string)=>void)=>void];
    const [query,subQueriesCallback] = hardDriveQueryParameters;
    return db.query(...query)
        .then((result:any)=>{
            let reportID = result.rows[0].report_id;
            log(`Report ID: ${reportID}\n`);
            log(`starting subqueries\n`);
            subQueriesCallback(reportID,db,log);
        })
        .catch((err:any)=> {
            log(err)
            throw err
        })
        .finally(()=>{log("Query Complete")})

}