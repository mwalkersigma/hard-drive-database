import parseXMLFile from "../../modules/parseXMLFile";
import buildHardDriveQuery from "../../modules/insertQueryBuilder/buildHardDriveQuery";
import db from "../../db/index";
import makeReportsFromBatch from "../../modules/makeReportsFromBatchFiles";


function handleSingleReport (parsedFile:any,name:string,company:string) {
    parsedFile.report.name = name;
    parsedFile.report.company = company;
    // this returns a [string,string[]] and a callback function
    // the call back function takes the report_id and the db pool
    // and executes the subqueries
    // which add the data for the report to the database
    let hardDriveQueryParameters = buildHardDriveQuery(parsedFile.report) as [[string,any[]], (report_id: any, pool: any, log: string)=>void];
    const [query,subQueriesCallback] = hardDriveQueryParameters;
    let log = '';
    return db.query(...query)
        .then((result:any)=>{
            let reportID = result.rows[0].report_id;
            log += `Report ID: ${reportID}\n`;
            log += `starting subqueries\n`;
            subQueriesCallback(reportID,db,log);
        })
        .catch((err:any)=>console.warn(err))
        .finally(()=>{
            return {text:log}
        })

}
function handleBatchReport (parsedFile:any,name:string,company:string){
    parsedFile.report.name = name;
    parsedFile.report.company = company;
    let reports = makeReportsFromBatch(parsedFile) as [{},{}[],{}[]];
    const [batchReportObject,reportQueries,taskQueries] = reports

}
export default function handler (req:any,res:any) {
    let type = "single";
    if(req.method !== 'POST') {res.status(400).json({text: 'Method not allowed'})}
    const name = req.query?.name;
    const company = req.query?.company;
    if(!name)return res.status(400).json({text: 'Name is required'})
    let parsedFile = parseXMLFile(req.body);
    if(parsedFile.report.bays || name.includes('batch'))type = "batch";
    if(type === "batch"){
            parsedFile.report.name = name;
            parsedFile.report.company = company;
            let reports = makeReportsFromBatch(parsedFile);

            let batchReport = reports[0] as {};
            let singleReports = reports[1] as {}[];
            let batchTasks = reports[2] as {}[];

            let addBatchReportIdQuery = `
            UPDATE report SET batch_report_id = $1 WHERE report_id = $2;
            `
            let batchSetQuery = `
            INSERT INTO batch_report (created, provider, version, kernel_version, started, elapsed, result) 
            VALUES ($1,$2,$3,$4,$5,$6,$7) 
            RETURNING batch_report_id;
            `

            return db.query(batchSetQuery,[].concat(Object.values(batchReport)))
            .then((result:any)=>{
                let batchReportId = result.rows[0].batch_report_id;
                singleReports.forEach((report:any)=>{
                    let hdq = buildHardDriveQuery(report);
                    let query = hdq[0] as [string, any[]];
                    let subQueriesCallback = hdq[1] as (report_id: any, pool: any) => void;
                    db.query(...query)
                        .then((result: any) => {
                            subQueriesCallback(result.rows[0].report_id, db);
                            db.query(addBatchReportIdQuery,[batchReportId,result.rows[0].report_id])
                                .catch((err:any)=>console.warn(err))
                        })
                })

            })
            .finally(()=>{
             res.status(200).json({text:'Batch file processed'})
            })

        }
    switch (type) {
        case "single":
            handleSingleReport(parsedFile,name,company)
                .then((result:any)=>{
                    res.status(200).json(result)
                })
            break;
        default:
            res.status(400).json({text: 'Invalid report type'})


    }
}