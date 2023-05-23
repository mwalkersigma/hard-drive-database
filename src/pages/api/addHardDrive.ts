import parseXMLFile from "../../modules/parseXMLFile";
import validateRequest from "../../modules/validateRequest";
import handleRes from "../../modules/handleRes";
import db from "../../db";
import handleSingleReport from "../../modules/xmlFileHandler/reportHandler";
import handleBatchReport from "../../modules/xmlFileHandler/batchHandler";
import getDateString from "../../modules/getDateString";


interface Handlers {
    [key:string]:(parsedFile:any,log:any)=>any
}




function determineReportType(file:any){
    return (file.report?.bays || file.report.name.includes("batch")) ? "batch" : "single"
}
async function handledDifferent (req:any,res:any) {
    let responder = handleRes(res);
    let {valid,message} = validateRequest(req);
    if(!valid){
        responder(400,message);
        return;
    }
    const parsedReportFile:any = parseXMLFile(req.body);
    parsedReportFile.report.name = req.query.name;
    parsedReportFile.report.company = req.query.company;
    const reportType:string = determineReportType(parsedReportFile);
    let handlers : Handlers  = {single:handleSingleReport,batch:handleBatchReport};
    db.logger.log(`Handling ${reportType} report`);
    return handlers[reportType](parsedReportFile,db.logger.log)


}

export default function handler (req:any,res:any) {
    let responder = handleRes(res);
    db.logger.log(`request started at : ${getDateString()}`)
    return handledDifferent(req,res)
        .then(()=>{
            responder(200,"File Successfully parsed");
            db.logger.log(`File Successfully parsed : ${req.query.name}}`);
            return;
        })
        .catch((e:any)=>{
            db.logger.log(e)
            responder(400,e);
            return;
        })
}
