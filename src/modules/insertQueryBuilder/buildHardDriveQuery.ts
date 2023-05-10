import buildHardDriveQueryHelper, {
    defaults,
    reportData
} from "../../modules/insertQueryBuilder/buildHardDriveQueryHelper"
import {parseDateFromXML} from "../parseDateFromXML";
function isIterable (input:any) {
    return typeof input[Symbol.iterator] === 'function'
}
export default function buildHardDriveQuery (parsedJSON:reportData,pool:any){
    const date = parseDateFromXML(parsedJSON.created);
    const provider = parsedJSON?.provider ?? defaults.STRING ;
    const kernel_version = parsedJSON?.kernel_version ?? defaults.STRING;
    const title = parsedJSON?.title ?? defaults.STRING;
    const file_name = parsedJSON?.name ?? defaults.STRING;
    let query =
        `
        INSERT INTO report (created,provider,kernel_version,title,file_name)
        VALUES($1,$2,$3,$4,$5)
        RETURNING report_id;
        `
    pool.query(query,[date,provider,kernel_version,title,file_name])
        .then((res:any)=>{
            const report_id = res.rows[0].report_id;
            const queries:any = buildHardDriveQueryHelper(report_id,parsedJSON);
            if(!isIterable(queries))return;
            for(let [qString,qParam] of queries){
                pool.query(qString,qParam)
                    .catch((err:any)=>console.warn(err))
            }
        })
        .catch((err:any)=>{
            throw new Error(err);
        })
}