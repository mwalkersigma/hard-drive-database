import parseXMLFile from "../../modules/parseXMLFile";
import validateRequest from "../../modules/validateRequest";
import handleRes from "../../modules/handleRes";
import db from "../../db";
import handleSingleReport from "../../modules/xmlFileHandler/reportHandler";
import handleBatchReport from "../../modules/xmlFileHandler/batchHandler";

interface Handlers {
    [key:string]:(parsedFile:any,log:any)=>any
}
async function checkIfFileHasBeenParsed(name:string){
   let hasName = await db.query(`SELECT file_name FROM report WHERE file_name = $1`,[name])
   return hasName.rows.length !== 0
}
function determineReportType(file:any){
    return (file.report?.bays || file.report.name.includes("batch")) ? "batch" : "single"
}

export default function handler (req:any,res:any) {
    let responder = handleRes(res);
    //db.logger.log(`request started at : ${getDateString()}`);
    return checkIfFileHasBeenParsed(req.query.name)
        .then((hasBeenParsed:boolean)=>hasBeenParsed && Promise.reject(" File Already Parsed"))
        .then(()=>validateRequest(req))
        .then(({valid,message})=> {
            console.log("Made it passed validation")
            if(valid) {
                const parsedReportFile: any = parseXMLFile(req.body);
                parsedReportFile.report.name = req.query.name;
                parsedReportFile.report.company = req.query.company_name;
                //console.log(JSON.stringify(parsedReportFile,null,2))
                const reportType = determineReportType(parsedReportFile);
               // db.logger.log(`Report Type: ${reportType}`);
                let handlers: Handlers = {single: handleSingleReport, batch: handleBatchReport};
                console.log("Choose a handler",reportType)
                return handlers[reportType](parsedReportFile, db.logger.log)
            }
            return Promise.reject(message)
        })
        .then(()=>{
            //db.logger.log(`File Successfully parsed : ${req.query.name}}`);
            console.log("made it all the way to the end of the promise chain")
            responder(200,"File Successfully parsed");
        })
        .catch((msg)=>responder(420,msg))
}

