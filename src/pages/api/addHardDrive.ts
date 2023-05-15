import parseXMLFile from "../../modules/parseXMLFile";
import buildHardDriveQuery from "../../modules/insertQueryBuilder/buildHardDriveQuery";
import db from "../../db/index";
import makeReportsFromBatch from "../../modules/makeReportsFromBatchFiles";

export default function handler (req:any,res:any) {
    let type = "single";
    if(req.method !== 'POST') {res.status(400).json({text: 'Method not allowed'})}
    const name = req.query?.name;
    const company = req.query?.company;
    if(!name)return res.status(400).json({text: 'Name is required'})
    let parsedFile = parseXMLFile(req.body);
    if(parsedFile.report.bays || name.includes('batch'))type = "batch";
    try {
        if(type === "single") {
            parsedFile.report.name = name;
            parsedFile.report.company = company;
            let hdQuery = buildHardDriveQuery(parsedFile.report);
            let query = hdQuery[0] as [string, any[]];
            let subQueriesCallback = hdQuery[1] as (report_id: any, pool: any) => void;
            db.query(...query)
                .then((result: any) => {
                    subQueriesCallback(result.rows[0].report_id, db);
                })
                .catch((err: any) => {
                    console.warn(err);
                    return res.status(400).json({text: err})
                });
        }else if(type === "batch"){
            parsedFile.report.name = name;
            parsedFile.report.company = company;
            let reports = makeReportsFromBatch(parsedFile);

            let batchReport = reports[0] as {};
            let singleReports = reports[1] as {}[];
            let batchTasks = reports[2] as {}[];

            let addBatchReportIdQuery = `
            UPDATE report SET batch_report_id = $1 WHERE report_id = $2;
            `


            //let batchQueries = buildHardDriveQuery(parsedFile.report);
            //let batchQuery = batchQueries[0] as [string, any[]];
            //db.query(...batchQuery)
            return res.status(400).json({text:'Batch files currently not supported'})
        }
    }catch (e) {
        return res.status(400).json({text:e})
    }
}