import db from "../../db/index";
import getDateString from "../../modules/getDateString";
import handleRes from "../../modules/handleRes";
// @ts-ignore
import searchInit from "search-algorithm-design"


async function getSearchData (field:string,table:string) {
    return await db.query(`SELECT ${field},report_id FROM ${table};`);
}
async function getAllAttributesByReportID(reportId:string){
    const erase = await db.query(`SELECT * FROM erase WHERE report_id = $1`,[reportId]);
    const device = await db.query(`SELECT * FROM device WHERE report_id = $1`,[reportId]);
    const errors = await db.query(`SELECT * FROM errors WHERE report_id = $1`,[reportId]);
    const sysinfo = await db.query(`SELECT * FROM sys_info WHERE report_id = $1`,[reportId]);
    const killDisk = await db.query(`SELECT * FROM kill_disk WHERE report_id = $1`,[reportId]);
    const results = await db.query(`SELECT * FROM results WHERE report_id = $1`,[reportId]);
    const smartAttributes = await db.query(`SELECT * FROM smart_attributes WHERE report_id = $1`,[reportId]);
    const smartParameters = await db.query(`SELECT * FROM smart_parameters WHERE report_id = $1`,[reportId]);
    const report = await db.query(`SELECT * FROM report WHERE report_id = $1`,[reportId]);
    const tasks = await db.query(`SELECT * FROM tasks WHERE report_id = $1`,[reportId]);
    const conclusion = await db.query(`SELECT * FROM conclusion WHERE report_id = $1`,[reportId]);

    return {erase, device, errors, sysinfo, killDisk, results, smartAttributes, smartParameters, report, tasks, conclusion}

}
// @ts-ignore
async function handleReportQuery(queryParams:any,res){
    // Creating defaults to help catch errors
    const defaults = {field:"serial_number",table:"device"};
    queryParams = {...defaults,...queryParams};
    const {value,field,table} = queryParams;

    let searchData = await getSearchData(field,table);
    const [search, dictionary] = searchInit(searchData,field,"report_id");
    let result:any = search.quickSearch(value);
    console.log("result",result)
    if(!result) handleRes(res)(400,'value for field not found');
    const {matchCandidate} = result;
    let reportIds = dictionary[matchCandidate];
    console.log("reportIds",reportIds)
    let resolvedPromises :any[] = [];
    for await (let reportId of reportIds){
        const completeData = await getAllAttributesByReportID(`${reportId}`);
        const erase =   completeData?.erase?.rows[0];
        const device =  completeData?.device?.rows[0];
        const errors =  completeData?.errors?.rows[0];
        const sysinfo = completeData?.sysinfo?.rows[0];
        const results = completeData?.results?.rows[0];
        const killDisk = completeData?.killDisk?.rows[0];
        const smartAttributes = completeData?.smartAttributes?.rows;
        const smartParameters = completeData?.smartParameters?.rows[0];
        const report = completeData?.report?.rows[0];
        const tasks = completeData?.tasks?.rows;
        const conclusion = completeData?.conclusion?.rows[0];

        resolvedPromises.push({erase,device,errors,sysinfo,results,killDisk,smartParameters,smartAttributes,report,tasks,conclusion})
    }
    return {resolvedPromises,result}
}

// @ts-ignore
export default function handler (req,res) {
    let queryParams = req.query;
    if(!queryParams)return res.status(400).json({text: 'Query is required'})
    db.logger.log(`request started at : ${getDateString()}`)
    try {
       return handleReportQuery(queryParams,res)
            .then((data) => {
               return res.status(200).json(JSON.stringify(data))
            })
            .catch((e) => {
                console.error(e)
                return res.status(400).json({text: 'Error'})
            })


    }catch (e) {
        console.error(e)
        return res.status(400).json({text: 'Error'})
    }
}
