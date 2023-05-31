export const defaults = {
    STRING:"not specified",
    INT:0,
    SHORT_STRING:"N/A",
    JSON:"{}",
}

const eraseQuery = (report_id:number,rawData:any,log:(message:string)=>void) => {
    const data = rawData?.erase;
    if(!data) return log("ERASE QUERY : erase data not found");
    const method = data?.method  || defaults.STRING;
    const passes  = data?.passes || defaults.INT
    const verification = data?.verification ?? defaults.SHORT_STRING;
    let query =
        `INSERT INTO erase ( report_id, method, passes, verification) VALUES (${report_id}, $1, $2, $3)`;
    let values = [method,passes,verification];
    return [query,values];
};
const killDiskQuery = (report_id:number,rawData:any,log:(message:string)=>void) => {
    const killDisk = rawData?.['kill_disk'];
    if(!killDisk) return log("KILL DISK QUERY : data not found");
    const processIntegrity = killDisk?.['process_integrity'] ?? defaults.STRING;
    const fingerprintWrite = killDisk?.fingerprint?.write ?? defaults.SHORT_STRING;
    const fingerprintValue = killDisk?.fingerprint?.value ?? defaults.SHORT_STRING;
    const rangeFirst = killDisk?.range?.first ?? defaults.INT;
    const rangeTotal = killDisk?.range?.total ?? defaults.STRING;
    const initialize = killDisk?.initialize ?? defaults.SHORT_STRING;
    let query =
        `INSERT INTO kill_disk ( report_id, process_integrity, fingerprint, write, range_first, range_total, disk_init) 
         VALUES (${report_id}, $1, $2, $3, $4, $5, $6)`;
    let values = [processIntegrity,fingerprintValue,fingerprintWrite,rangeFirst,rangeTotal,initialize];
    return [query,values];
}
const errorQuery = (report_id:number,rawData:any,log:(message:string)=>void) => {
    const errorData = rawData?.errors;
    if(!errorData) return log("ERROR QUERY : Error data not found");
    const lockSource = errorData?.lock_source ?? defaults.SHORT_STRING;
    const retries = errorData?.retries ?? defaults.INT;
    const errorLimit = errorData?.error_limit ?? defaults.INT;
    const skip = errorData?.skip ?? defaults.INT;
    const timeout = errorData?.timeout ?? defaults.INT;
    const terminate = errorData?.terminate ?? defaults.SHORT_STRING;
    const ignoreLock = errorData?.ignore?.lock ?? defaults.SHORT_STRING;
    const ignoreRead = errorData?.ignore?.read ?? defaults.SHORT_STRING;
    const ignoreWrite = errorData?.ignore?.write ?? defaults.SHORT_STRING;
    let query =
        `INSERT INTO errors ( report_id, lock_source, retries, error_limit, skip, timeout, terminate, ignore_lock, ignore_read, ignore_write)
            VALUES (${report_id}, $1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    let values = [lockSource,retries,errorLimit,skip,timeout,terminate,ignoreLock,ignoreRead,ignoreWrite];
    return [query,values];
}
const deviceQuery = (report_id:number,rawData:any,log:(message:string)=>void) => {
    const device = rawData.device;
    if(!device) return log("DEVICE QUERY : data not found");
    const title = device?.title?.Name ?? defaults.STRING;
    const serialNumber = device?.['serial_number']?.['serial_number'] ?? defaults.STRING;
    const platformName = device?.platformname?.['platform_name'] ?? defaults.STRING;
    const productName = device?.product?.['product_name'] ?? defaults.STRING;
    const type = device?.type?.Type ?? defaults.STRING;
    const revision = device?.revision?.['product_revision'] ?? defaults.STRING;
    const partitioning = device?.geometry?.partitioning?.partitioning ?? defaults.STRING;
    const totalSectors = device?.geometry?.['total_sec']?.['total_sectors'] ?? defaults.STRING;
    const firstSector = device?.geometry?.['first_sec']?.['first_sector'] ?? defaults.INT;
    const bytesPerSector = device?.geometry?.bps?.['bytes_per_sector'] ?? defaults.INT;
    let query =
        `INSERT INTO device ( report_id, name, serial_number, platform_name, product_name, type, product_revision, partitioning, total_sectors, first_sector, bytes_per_sector)
        VALUES (${report_id}, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
    let values = [title,serialNumber,platformName,productName,type,revision,partitioning,totalSectors,firstSector,bytesPerSector];
    return [query,values];
}
const resultsQuery = (report_id:number,rawData:any,log:(message:string)=>void) => {
    const results = rawData?.results;
    if(!results) return log("RESULTS QUERY : data not found");
    const startedAt = results?.started?.started_at ?? defaults.STRING;
    const duration = results?.elapsed?.duration ?? defaults.STRING;
    const errors = results?.process?.errors?.Errors ?? defaults.STRING;
    const name = results?.process?.name.name ?? defaults.STRING;
    const result = results?.process?.result.result ?? defaults.STRING;
    const queryString =
        `INSERT INTO results ( report_id, start_at, duration, process_errors, process_name, process_results)
        VALUES (${report_id}, $1, $2, $3, $4, $5)`;
    const queryValues = [startedAt,duration,errors,name,result];
    return [queryString,queryValues];
}
const sysInfoQuery = (report_id:number,rawData:any,log:(message:string)=>void) => {
    const sysInfo = rawData?.sysinfo;
    if(!sysInfo) return log("SYSINFO : data not found");
    const os = sysInfo?.os ?? defaults.STRING;
    const platform = sysInfo?.platform ?? defaults.STRING;
    const kernel = sysInfo?.kernel ?? defaults.STRING;
    const adminRights = sysInfo?.['admin_rights'] ?? defaults.STRING;
    const hostname = sysInfo?.hostname ?? defaults.STRING;
    const queryString =
        `INSERT INTO sys_info ( report_id, os, platform, kernel,admin_rights,hostname)
        VALUES (${report_id}, $1, $2, $3, $4, $5)`;
    const queryValues = [os,platform,kernel,adminRights,hostname];
    return [queryString,queryValues];
}
const smart_AttributesQuery = (report_id:number,rawData:any,log:(message:string)=>void) => {
    const smartAttributes = rawData.device?.['smart_attributes'];
    if(!smartAttributes)return log("SMART ATTRIBUTES QUERY : data not found");
    return smartAttributes.attr.map((attr:any) => {
        const id = attr['title'] ?? defaults.STRING;
        const value = attr.value ?? defaults.INT;
        const worst = attr.worst ?? defaults.INT;
        const threshold = attr.threshold ?? defaults.INT;
        const type = attr.type ?? defaults.STRING;
        const updated = attr.updated ?? defaults.STRING;
        const whenFailed = attr["when_failed"] ?? defaults.STRING;
        const rawValue = attr["raw_value"] ?? defaults.STRING;
        return [`
        INSERT INTO smart_attributes (report_id, title, value, worst, threshold, attr_type, updated, when_failed, raw_value)
        VALUES (${report_id},$1,$2,$3,$4,$5,$6,$7,$8);`,
            [id,value,worst,threshold,type,updated,whenFailed,rawValue]
        ]
    })
}
const smart_parametersQuery = (report_id:number,rawData:any,log:(message:string)=>void) => {
    const smartParameters = rawData.device?.smart_parameters;
    if(!smartParameters) return log("SMART PARAMETERS : data not found");
    const deviceModel = smartParameters?.['device_model'] ?? defaults.STRING;
    const firmwareVersion = smartParameters?.['firmware_version'] ?? defaults.STRING;
    const capacity = smartParameters?.capacity ?? defaults.STRING;
    const ataVersion = smartParameters?.['ata_version'] ?? defaults.INT;
    const ataStandard = smartParameters?.['ata_standard'] ?? defaults.STRING;
    const smartSupport = smartParameters?.['smart_support'] ?? defaults.INT;
    const offlineDataCollectionStatus = smartParameters?.['off_line_data_collection_status'] ?? defaults.INT;
    const selfTestExecutionStatus = smartParameters?.['self_test_execution_status'] ?? defaults.INT;
    const timeOfflineDataCollection = smartParameters?.["time_off_line_data_collection"] ?? defaults.INT;
    const offlineDataCollectionCapability = smartParameters?.['off_line_data_collection_capabilities'] ?? defaults.INT;
    const smartCapability = smartParameters?.['smart_capabilities'] ?? defaults.INT;
    const errorLoggingCapability = smartParameters?.['error_logging_capabilities'] ?? defaults.INT;
    const shortSelfTestTime = smartParameters?.['short_self_test_time'] ?? defaults.INT;
    const extendedSelfTestTime = smartParameters?.['extended_self_test_time'] ?? defaults.INT;

    return [`
        INSERT INTO smart_parameters (report_id, device_model, firmware_version, capacity, ata_version, ata_standard, smart_support, offline_data_collection_status, self_test_execution_status, time_offline_data_collection_sec, offline_data_collection_capabilities, smart_capabilities, error_logging_capabilities, short_self_test_time_min, extended_self_test_time_min)
        VALUES (${report_id},$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);`,
        [deviceModel,firmwareVersion,capacity,ataVersion,ataStandard,smartSupport,offlineDataCollectionStatus,selfTestExecutionStatus,timeOfflineDataCollection,offlineDataCollectionCapability,smartCapability,errorLoggingCapability,shortSelfTestTime,extendedSelfTestTime]
    ]
}
const taskQuery = (report_id:number,rawData:any,log:(message:string)=>void) => {
    const tasks = rawData?.tasks;
    if(!tasks) return log("TASKS : data not found");
    return tasks.map((task:any) => {
        let taskTitle = task?.title ?? defaults.STRING;
        let taskData = task?.data ?? defaults.JSON;
        let queryString = `INSERT INTO tasks (report_id, task_title, task_data) VALUES (${report_id},$1,$2);`
        let queryValues = [taskTitle,taskData];
        return [queryString,queryValues];
    })
}

const conclusionQuery = (report_id:number,rawData:any,log:(message:string)=>void) => {
    let conclusion = rawData?.conclusion;
    let temp;
    if(!conclusion){
        log("CONCLUSION : data not found");
        return
    }
    if(typeof conclusion === 'string'){
        temp = conclusion;
        conclusion = {value:temp};
    }
    const queryString = `INSERT INTO conclusion (report_id, value) VALUES (${report_id},$1);`;
    const queryValues = [conclusion.value];
    return [queryString,queryValues];
}
/**
 * @name buildHardDriveQueryHelper
 * @description Builds the queries for inserting hardrives into the database
 * @description takes in the parsed XML data in the form of a JSON object
 * @param {number} report_id
 * @param {JSON} parsedXMLData
 * @param {string} log
 * @returns {Array} Array of queries and values to be inserted into the database
 */
function buildHardDriveQueryHelper (report_id:number,parsedXMLData:any,log:(message:string)=>void) {
    const singleFieldQueries = [
        eraseQuery,
        deviceQuery,
        resultsQuery,
        errorQuery,
        killDiskQuery,
        sysInfoQuery,
        smart_parametersQuery,
        conclusionQuery,
    ];
    const multiFieldQueries = [
        smart_AttributesQuery,
        taskQuery
    ]
    try {
        let queries = singleFieldQueries
            .map((query:any) => query(report_id,parsedXMLData,log));
        multiFieldQueries
            .map((query:any) => query(report_id,parsedXMLData,log))
            .filter((query:any) => query !== undefined)
            .forEach(query => queries.push(...query));
        return queries.filter((query:any)=>query !== undefined)
    } catch (error) {
        log(`${error}`);
        return error;
    }
}

export default buildHardDriveQueryHelper;
