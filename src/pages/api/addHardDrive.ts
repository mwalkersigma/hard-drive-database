import parseXMLFile from "../../modules/parseXMLFile";
import buildHardDriveQuery from "../../modules/insertQueryBuilder/buildHardDriveQuery";
import db from "../../db/index";

export default function handler (req:any,res:any) {
    if(req.method !== 'POST') {res.status(400).json({text: 'Method not allowed'})}
    const name = req.query?.name;
    const serial = req.query?.serial;
    const company = req.query?.company;
    if(!name)return res.status(400).json({text: 'Name is required'})
    let parsedFile = parseXMLFile(req.body);
    if(parsedFile.report.bays || name.includes('batch'))return res.status(400).json({text:'Batch files currently not supported'})
    try {
        parsedFile.report.name = name;
        parsedFile.report.serial = serial;
        parsedFile.report.company = company;
        buildHardDriveQuery(parsedFile.report,db);
        return res.status(200).json({text:`File: ${name} has been added to the database`})
    }catch (e) {
        return res.status(400).json({text:e})
    }
}