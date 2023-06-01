import parseXMLFile from "../../modules/parseXMLFile";
import validateRequest from "../../modules/validateRequest";
import handleRes from "../../modules/handleRes";
import db from "../../db";
import handleSingleReport from "../../modules/xmlFileHandler/reportHandler";
import handleBatchReport from "../../modules/xmlFileHandler/batchHandler";
import getDateString from "../../modules/getDateString";

// get the day from date string
let currentDay = "";
let getCurrentDay = ()=>getDateString().split(" ")[1].split(",")[0];
let fileNames:any[] = []
interface Handlers {
    [key:string]:(parsedFile:any,log:any)=>any
}
async function getFileNames(){
    if(getCurrentDay() === currentDay){
        return fileNames;
    }
    let filenameRows = await db.query(`SELECT file_name FROM report;`);
    fileNames = filenameRows.rows.map((row:any)=>row.file_name);
    currentDay = getCurrentDay();
    return fileNames;
}
function determineReportType(file:any){
    return (file.report?.bays || file.report.name.includes("batch")) ? "batch" : "single"
}


export default function handler (req:any,res:any) {
    let responder = handleRes(res);
    db.logger.log(`request started at : ${getDateString()}`);
    return getFileNames()
            .then((filenames)=>validateRequest(req,filenames))
            .then(({valid,message})=> {
                if(valid) {
                    const parsedReportFile: any = parseXMLFile(req.body);
                    parsedReportFile.report.name = req.query.name;
                    parsedReportFile.report.company = req.query.name;
                    const reportType = determineReportType(parsedReportFile);
                    let handlers: Handlers = {single: handleSingleReport, batch: handleBatchReport};
                    db.logger.log(`Handling ${reportType} report`);
                    return handlers[reportType](parsedReportFile, db.logger.log)
                }
                return Promise.reject(" File Already Parsed")

            })
            .then(()=>{
                db.logger.log(`File Successfully parsed : ${req.query.name}}`);
                fileNames.push(req.query.name)
                responder(200,"File Successfully parsed");
            })
            .catch(()=>responder(413,"File has already been parsed"))
}
