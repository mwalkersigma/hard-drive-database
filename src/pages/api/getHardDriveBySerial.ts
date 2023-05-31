import DB from "../../db/index";
import Logger from "../../modules/logger";
const db = {query:DB.query(new Logger().log)};
// @ts-ignore
async function handleQuery (queryParams,res) {
    const {serial_number} = queryParams;
    let reportIdQuery = await db.query(`
        SELECT report.report_id 
        FROM report 
        INNER JOIN device ON report.report_id = device.report_id
        WHERE device.serial_number = $1
        `,[serial_number]);
    if(reportIdQuery.rows.length === 0) return res.status(400).json({text: 'Serial number not found'})
    let reportId = reportIdQuery.rows[0].report_id;
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

    // Here is where getting multiple results would be handled on the backend
    return {
        report:report.rows?.[0],
        erase:erase.rows?.[0],
        device:device.rows?.[0],
        errors:errors.rows?.[0],
        sysinfo:sysinfo.rows?.[0],
        killDisk:killDisk.rows?.[0],
        results:results.rows?.[0],
        smartAttributes:smartAttributes.rows?.[0],
        smartParameters:smartParameters.rows?.[0],
        tasks:tasks.rows
    }
}


// @ts-ignore
export default function handler (req,res) {
    let queryParams = req.query;
    if(!queryParams)return res.status(400).json({text: 'Query is required'})
    try {
       return handleQuery(queryParams,res)
            .then((data) => {
                console.log(data)
                res.status(200).json(JSON.stringify(data))
            })
            .catch((e) => {
                console.error(e)
                res.status(400).json({text: 'Error'})
            })


    }catch (e) {
        console.error(e)
        res.status(400).json({text: 'Error'})
    }
}
