import db from "../../db/index";
import getDateString from "../../modules/getDateString";
import Search from "../../modules/search/search";
import NaiveSearch from "../../modules/search/algorithms/naive";
import FilteredSearch from "../../modules/search/algorithms/filtered";
import KMPSearch from "../../modules/search/algorithms/kmp";
import LevenshteinDistanceSearch from "../../modules/search/algorithms/levenschteinDistance";
import handleRes from "../../modules/handleRes";
/*
step one -> build search
step two -> get data to search
step three -> find best match and return report id
step four -> get all data from report id
optional
 */

function getSearch () {
    let search = new Search();
    search.addAlgorithm(new NaiveSearch());
    search.addAlgorithm(new FilteredSearch());
    search.addAlgorithm(new KMPSearch());
    search.addAlgorithm(new LevenshteinDistanceSearch());
    return search;
}
async function getSearchData (field:string,table:string) {
    return await db.query(`SELECT ${field},report_id FROM ${table};`);
}

function processSearchData (searchData:any,field:string) {
    return searchData.rows.map((row: any, i: any) => row[field])
}

function createSearchDictionary(searchData:any,field:string){
    return searchData.rows.reduce((acc:any,row:any)=>{
        //if(acc[row.serial_number])console.log(`Duplicate serial number found: ${row.serial_number} todo`);
        acc[row[field].toUpperCase()] = row.report_id;
        return acc;
    }, {})
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
async function handleSingleReportQuery(queryParams:any,res,search){
    // Creating defaults to help catch errors
    const defaults = {field:"serial_number",table:"device"};
    queryParams = {...defaults,...queryParams};
    const {value,field,table} = queryParams;

    let searchData = await getSearchData(field,table);
    console.log(searchData)
    const processedSearchData = processSearchData(searchData,field);
    const dictionary = createSearchDictionary(searchData,field);

    search.init(processedSearchData);

    let result:{matchCandidate:string}|undefined = search.quickSearch(value);
    if(!result)return [];
    const {matchCandidate} = result;
    if(!result) handleRes(res)(400,'value for field not found');
    let reportId = dictionary[matchCandidate];
    const completeData = await getAllAttributesByReportID(reportId);
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

    return {erase,device,errors,sysinfo,results,killDisk,smartParameters,smartAttributes,report,tasks,conclusion}
}



// @ts-ignore
async function handleQuery (queryParams,res,search) {
    let defaults = {field:"serial_number",table:"device"};
    queryParams = {...defaults,...queryParams};
    const {value,field,table} = queryParams;
    let allField = await db.query(`SELECT ${field},report_id FROM ${table};`);
    let serials = allField.rows.map((item:any)=>item[field]);
    // take the collection of {serial_number,report_id} and turn it into a dictionary
    // with the following shape {serial_number:report_id}
    let dictionary = allField.rows.reduce((acc:any,row:any)=>{
        //if(acc[row.serial_number])console.log(`Duplicate serial number found: ${row.serial_number} todo`);
        acc[row[field].toUpperCase()] = row.report_id;
        return acc;
    },
        {})
    search.init(serials);
    let result:{matchCandidate:string}|undefined = search.quickSearch(value);
    if(!result)return [];
    const {matchCandidate} = result;
    if(!result) handleRes(res)(400,'value for field not found');
    let reportId = dictionary[matchCandidate];

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

    return {
        report:report.rows?.[0],
        erase:erase.rows?.[0],
        device:device.rows?.[0],
        errors:errors.rows?.[0],
        sysinfo:sysinfo.rows?.[0],
        killDisk:killDisk.rows?.[0],
        results:results.rows?.[0],
        smartAttributes:smartAttributes.rows,
        smartParameters:smartParameters.rows?.[0],
        tasks:tasks.rows,
        conclusion:conclusion.rows?.[0]
    }
}


// @ts-ignore
export default function handler (req,res) {
    let queryParams = req.query;
    if(!queryParams)return res.status(400).json({text: 'Query is required'})
    db.logger.log(`request started at : ${getDateString()}`)
    try {
        let search = getSearch();
       return handleSingleReportQuery(queryParams,res,search)
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
