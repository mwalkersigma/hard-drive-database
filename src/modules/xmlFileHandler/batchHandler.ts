import db from "../../db/index";
import makeReportsFromBatch from "../makeReportsFromBatchFiles";
import buildBatchQuery, {BatchReport} from "../insertQueryBuilder/buildBatchQuery";
import buildHardDriveQuery from "../insertQueryBuilder/buildHardDriveQuery";

export default function handleBatchReport (parsedFile:any){
    const logger = db.logger;
    const {log}=logger;
    const [batchReportObject,reportQueries,taskQueries] = makeReportsFromBatch(parsedFile) as [BatchReport,{}[],{task_title:string,task_data:any}[]];
    const addBatchReportQuery = buildBatchQuery(batchReportObject);
    console.log("built batch query");
    console.log(`Batch Report: ${batchReportObject}\n`);
    return db
        .query(...addBatchReportQuery)
        .then((batchResult:any)=>{
            console.log("Batch Report Added")
            let batchReportId = batchResult.rows[0].batch_report_id;
            reportQueries.forEach((reportQuery:any)=>{
                let [query,subQueryCallback] = buildHardDriveQuery(reportQuery)as [[string,any[]], (report_id: any, pool: any,log:(message:string)=>void)=>void];
                db.query(...query)
                    .then((result:any)=>{
                        console.log("Query Complete");
                        let reportID = result.rows[0].report_id;
                        log(`Report ID: ${reportID}\n`)
                        log(`starting subqueries\n`)
                        subQueryCallback(reportID,db,log);
                        db.query(`UPDATE report SET batch_report_id = $1 WHERE report_id = $2;`,[batchReportId,reportID])
                            .then(()=>{console.log(`Added batch report id to report ${reportID}\n`)})
                            .catch((err:any)=> {
                                console.log(`${err}`)
                                throw new Error(err);
                            });
                    })
                    .catch((err:any)=> log(`${err}`))
            })
            taskQueries.forEach(({task_title,task_data}:{task_title:string,task_data:any })=>{
                db.query(
                    `INSERT INTO batch_tasks (batch_report_id,title,data) VALUES ($1,$2,$3);`,
                    [batchReportId,task_title,task_data])
                    .then(()=>{log(`Added task ${task_title} to batch report ${batchReportId}\n`)})
            })
        })
        .catch((err:any)=> {log(`${err}`); throw err})
        .finally(()=>{log("Query Complete")})

}
