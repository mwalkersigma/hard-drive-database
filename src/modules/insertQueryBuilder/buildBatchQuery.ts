
/*
batch_report
batch_tasks
report
conclusion
errors
tasks
 */
import {parseDateFromXML} from "../parseDateFromXML";

interface BatchReport {
    result: any;
    elapsed: any;
    started: any;
    kernel_version: any;
    version: any;
    provider: any;
    created: any;
}
export default function buildBatchQuery(batchReport:any,){
    let batchQuery = `
    INSERT INTO batch_report (created,provider,version,kernel_version,started,elapsed,result)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING batch_report_id;
    `
    let batchQueryValues = [
        parseDateFromXML(batchReport.created),
        batchReport.provider,
        batchReport.version,
        batchReport.kernel_version,
        batchReport.started,
        batchReport.elapsed,
        batchReport.result
    ];
    return [batchQuery,batchQueryValues] as [string,any[]]
}
