
/*
batch_report
batch_tasks
report
conclusion
errors
tasks
 */
interface BatchReport {
    result: any;
    elapsed: any;
    started: any;
    kernel_version: any;
    version: any;
    provider: any;
    created: any;
}
function buildBatchQuery(inputData:[BatchReport,{}[],[][]]){
    const [batchReport] = inputData;
    let batchQuery = `
    INSERT INTO batch_report (created,provider,version,kernel_version,started,elapsed,result)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING batch_report_id;
    `
    let batchQueryValues = [
        batchReport.created,
        batchReport.provider,
        batchReport.version,
        batchReport.kernel_version,
        batchReport.started,
        batchReport.elapsed,
        batchReport.result
    ];
    let reportQuery = `
    INSERT INTO report (batch_report_id,created,provider,kernel_version,title,file_name,customer)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING report_id;
    `;

    let taskQuery = `
    INSERT INTO batch_tasks (batch_report_id,title,data,batch_tasks_id)
    VALUES ($1,$2,$3);
    `;
    return [[batchQuery,batchQueryValues],reportQuery,taskQuery];

}