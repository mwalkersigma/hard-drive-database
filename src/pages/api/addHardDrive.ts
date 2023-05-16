import parseXMLFile from "../../modules/parseXMLFile";
import buildHardDriveQuery from "../../modules/insertQueryBuilder/buildHardDriveQuery";
import db from "../../db/index";
import makeReportsFromBatch from "../../modules/makeReportsFromBatchFiles";
import buildBatchQuery, {BatchReport} from "../../modules/insertQueryBuilder/buildBatchQuery";
const addBatchReportIdQuery :string = `UPDATE report SET batch_report_id = $1 WHERE report_id = $2;`
function handleSingleReport (parsedFile:any,name:string,company:string,log:string) {
    // this returns a [string,string[]] and a callback function
    // the call back function takes the report_id and the db pool
    // and executes the subqueries
    // which add the data for the report to the database
    let hardDriveQueryParameters = buildHardDriveQuery(parsedFile.report) as [[string,any[]], (report_id: any, pool: any, log: string)=>void];
    const [query,subQueriesCallback] = hardDriveQueryParameters;
    return db.query(...query)
        .then((result:any)=>{
            let reportID = result.rows[0].report_id;
            log += `Report ID: ${reportID}\n`;
            log += `starting subqueries\n`;
            subQueriesCallback(reportID,db,log);
        })
        .catch((err:any)=> log += `${err}`)
        .finally(()=>({log}))

}
function handleBatchReport (parsedFile:any,name:string,company:string,log:string){
    const [batchReportObject,reportQueries,taskQueries] = makeReportsFromBatch(parsedFile) as [BatchReport,{}[],{task_title:string,task_data:any}[]];
    const addBatchReportQuery = buildBatchQuery(batchReportObject);
    log += `Batch Report: ${batchReportObject}\n`;
    return db
        .query(...addBatchReportQuery)
        .then((batchResult:any)=>{
            let batchReportId = batchResult.rows[0].batch_report_id;
            reportQueries.forEach((reportQuery:any)=>{
                let [query,subQueryCallback] = buildHardDriveQuery(reportQuery)as [[string,any[]], (report_id: any, pool: any,log:string)=>void];
                db.query(...query)
                    .then((result:any)=>{
                        let reportID = result.rows[0].report_id;
                        log += `Report ID: ${reportID}\n`;
                        log += `starting subqueries\n`;
                        subQueryCallback(reportID,db,log);
                        db.query(addBatchReportIdQuery,[batchReportId,reportID])
                            .then(()=>{log += `Added batch report id to report ${reportID}\n`})
                            .catch((err:any)=> log += `${err}`);
                    })
                    .catch((err:any)=> log += `${err}`)
            })
            taskQueries.forEach(({task_title,task_data}:{task_title:string,task_data:any })=>{
                db.query(
                    `INSERT INTO batch_tasks (batch_report_id,title,data) VALUES ($1,$2,$3);`,
                    [batchReportId,task_title,task_data])
                    .then(()=>{log += `Added task ${task_title} to batch report ${batchReportId}\n`})
            })
        })
        .catch((err:any)=> log += `${err}`)
        .finally(()=>({log}))

}
export default function handler (req:any,res:any) {
    let type : "single" | "batch" = "single";
    if(req.method !== 'POST') {return res.status(400).json({text: 'Method not allowed'})}
    const name = req.query?.name;
    const company = req.query?.['company_name'];
    if(!name)return res.status(400).json({text: 'Name is required'})
    let parsedFile = parseXMLFile(req.body);
    parsedFile.report.name = name;
    parsedFile.report.company = company;
    if(parsedFile.report.bays || name.includes('batch'))type = "batch";
    let handlers = {single:handleSingleReport,batch:handleBatchReport};
    let log = '';
    return handlers[type](parsedFile,name,company,log)
            .then((result:any)=>{
                res.status(200).json({text: 'Success',log:result})
            })
}
