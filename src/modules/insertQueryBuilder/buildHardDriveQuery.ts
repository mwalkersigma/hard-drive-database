import buildHardDriveQueryHelper, {defaults} from "../../modules/insertQueryBuilder/buildHardDriveQueryHelper"
import {parseDateFromXML} from "../parseDateFromXML";
function isIterable (input:any) {
    return typeof input[Symbol.iterator] === 'function'
}
export default function buildHardDriveQuery (parsedJSON:any){
    console.log("here")
    const date = parseDateFromXML(parsedJSON.created);
    const provider = parsedJSON?.provider ?? defaults.STRING ;
    const kernel_version = parsedJSON?.kernel_version ?? defaults.STRING;
    const title = parsedJSON?.title ?? defaults.STRING;
    const file_name = parsedJSON?.name ?? defaults.STRING;
    const company = parsedJSON?.company ?? defaults.STRING;
    let query =
        `
        INSERT INTO report (created,provider,kernel_version,title,file_name,customer)
        VALUES($1,$2,$3,$4,$5,$6)
        RETURNING report_id;
        `
    return [[query,[date,provider,kernel_version,title,file_name,company]],(report_id:any,pool:any,log:(message:string)=>void)=>{
        console.log("here")
        const queries:any = buildHardDriveQueryHelper(report_id,parsedJSON,log);
        if(!isIterable(queries))return;
        for(let [qString,qParam] of queries){
            pool.query(qString,qParam)
                .catch((err:any)=>log(err))
        }
    }]
}
