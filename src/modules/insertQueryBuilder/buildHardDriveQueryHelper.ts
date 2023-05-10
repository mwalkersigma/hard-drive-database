export const defaults = {
    STRING:"not specified",
    INT:0,
    SHORT_STRING:"N/A"
}





interface EraseData {
    method:string | null,
    passes:string | null,
    verification:string | null
}
interface KillDiskData {
    'process-integrity':string | null,
    fingerprint:{
        write:string | null,
        value:string | null
    }
    range:{
        first:string | null,
        total:string | null
    }
    initialize :string | null,
}
interface ErrorData {
    lock_source: string | null;
    retries: string | null;
    errorLimit: string | null;
    skip: string | null;
    timeout: string | null;
    terminate: string | null;
    ignore: {
        lock: string | null;
        read: string | null;
        write: string | null;
    };
}
interface deviceData {
    title:{
        name:string | null,
    }
    'serial-number':{
        'serial number' : string | null,
    }
    platformname : {
        'platform name' : string | null,
    }
    product :{
        'product name' : string | null,
    }
    type : {
        Type : string | null,
    }
    revision : {
        'Product Revision' : string | null,
    }
    geometry : {
        partitioning : {
            Partitioning:string | null,
        }
        'total-sec':{
            'Total Sectors':string | null,
        }
        'first-sec':{
            'First Sector':string | null,
        }
        bps:{
            'Bytes Per Sector':string | null,
        }
    }
    'smart_attributes' : smartAttributesData
    'smart_parameters' : smartParametersData
}
interface resultsData {
    started: {
        "Started at": string | null,
    }
    elapsed:{
            Duration:string | null,
    }
    process : {
        name: {
            Name:string | null,
        }
        errors : {
            Errors:string | null,
        }
        result : {
            Result:string | null,
        }
    }
}
interface smartParametersData {
    'device-model': string | null;
    'serial-number': string | null;
    'firmware-version': string | null;
    capacity: string | null;
    'ata-version': string | null;
    'ata-standard': string | null;
    'smart-support': string | null;
    'off-line-data-collection-status': string | null;
    'self-test-execution-status': string | null;
    'time-off-line-data-collection': string | null;
    'off-line-data-collection-capabilities': string | null;
    'smart-capabilities': string | null;
    'error-logging-capabilities': string | null;
    'short-self-test-time': string | null;
    'extended-self-test-time': string | null;
}
interface attrs {
    '@title': string;
    value: string;
    worst: string;
    threshold: string;
    type: string;
    updated: string;
   "when-failed": string;
    'raw-value': string;
}
interface smartAttributesData {
    attr: attrs[];
}
interface sys_infoData{
    "os": string | null;
    "platform": string | null
    "kernel": string | null
    "admin-rights": string | null
    "hostname": string | null
}
export interface reportData {
    company: string;
    created:string
    provider:string
    kernel_version:string
    title:string
    name:string
    device: deviceData;
    results: resultsData;
    sysinfo: sys_infoData;
    erase: EraseData;
    killDisk: KillDiskData;
    errors: ErrorData;
}
const eraseQuery = (report_id:number,rawData:any) => {
    const data = rawData?.erase;
    if(!data) return console.warn("ERASE QUERY : erase data not found");
    const method = data?.method  ?? defaults.STRING;
    const passes  = data?.passes ?? defaults.INT
    const verification = data?.verification ?? defaults.SHORT_STRING;
    let query =
        `INSERT INTO erase ( report_id, method, passes, verification) VALUES (${report_id}, $1, $2, $3)`;
    let values = [method,passes,verification];
    return [query,values];
};
const killDiskQuery = (report_id:number,rawData:any) => {
    const killDisk = rawData?.['kill-disk'];
    if(!killDisk) return console.warn("KILL DISK QUERY : data not found");
    const processIntegrity = killDisk?.['process-integrity'] ?? defaults.STRING;
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
const errorQuery = (report_id:number,rawData:any) => {
    const errorData = rawData?.errors;
    if(!errorData) return console.warn("ERROR QUERY : Error data not found");
    const lockSource = errorData?.lock_source ?? defaults.SHORT_STRING;
    const retries = errorData?.retries ?? defaults.INT;
    const errorLimit = errorData?.errorLimit ?? defaults.INT;
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
const deviceQuery = (report_id:number,rawData:any) => {
    const device = rawData?.device;
    if(!device) return console.warn("DEVICE QUERY : data not found");
    const title = device?.title?.Name ?? defaults.STRING;
    const serialNumber = device?.['serial-number']?.['Serial Number'] ?? defaults.STRING;
    const platformName = device?.platformname?.['Platform Name'] ?? defaults.STRING;
    const productName = device?.product?.['Product Name'] ?? defaults.STRING;
    const type = device?.type?.Type ?? defaults.STRING;
    const revision = device?.revision?.['Product Revision'] ?? defaults.STRING;
    const partitioning = device?.geometry?.partitioning?.Partitioning ?? defaults.STRING;
    const totalSectors = device?.geometry?.['total-sec']?.['Total Sectors'] ?? defaults.STRING;
    const firstSector = device?.geometry?.['first-sec']?.['First Sector'] ?? defaults.INT;
    const bytesPerSector = device?.geometry?.bps?.['Bytes per Sector'] ?? defaults.INT;
    let query =
        `INSERT INTO device ( report_id, name, serial_number, platform_name, product_name, type, product_revision, partitioning, total_sectors, first_sector, bytes_per_sector)
        VALUES (${report_id}, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
    let values = [title,serialNumber,platformName,productName,type,revision,partitioning,totalSectors,firstSector,bytesPerSector];
    return [query,values];
}
const resultsQuery = (report_id:number,rawData:any) => {
    const results = rawData?.results;
    if(!results) return console.warn("RESULTS QUERY : data not found");
    const startedAt = results?.started["Started at"] ?? defaults.STRING;
    const duration = results?.elapsed?.Duration ?? defaults.STRING;
    const errors = results?.process.errors?.Errors ?? defaults.STRING;
    const name = results?.process.name.Name ?? defaults.STRING;
    const result = results?.process.result.Result ?? defaults.STRING;
    const queryString =
        `INSERT INTO results ( report_id, start_at, duration, process_errors, process_name, process_results)
        VALUES (${report_id}, $1, $2, $3, $4, $5)`;
    const queryValues = [startedAt,duration,errors,name,result];
    return [queryString,queryValues];
}
const sysInfoQuery = (report_id:number,rawData:any) => {
    const sysInfo = rawData?.sysinfo;
    if(!sysInfo) return console.warn("SYSINFO : data not found");
    const os = sysInfo?.os ?? defaults.STRING;
    const platform = sysInfo?.platform ?? defaults.STRING;
    const kernel = sysInfo?.kernel ?? defaults.STRING;
    const adminRights = sysInfo?.['admin-rights'] ?? defaults.STRING;
    const hostname = sysInfo?.hostname ?? defaults.STRING;
    const queryString =
        `INSERT INTO sys_info ( report_id, os, platform, kernel,admin_rights,hostname)
        VALUES (${report_id}, $1, $2, $3, $4, $5)`;
    const queryValues = [os,platform,kernel,adminRights,hostname];
    return [queryString,queryValues];
}
const smart_AttributesQuery = (report_id:number,rawData:any) => {
    const smartAttributes = rawData?.['smart-attributes'];
    if(!smartAttributes)return console.warn("SMART ATTRIBUTES QUERY : data not found");
    return smartAttributes.attr.map((attr:any) => {
        const id = attr['@title'] ?? defaults.STRING;
        const value = attr.value ?? defaults.INT;
        const worst = attr.worst ?? defaults.INT;
        const threshold = attr.threshold ?? defaults.INT;
        const type = attr.type ?? defaults.STRING;
        const updated = attr.updated ?? defaults.STRING;
        const whenFailed = attr["when-failed"] ?? defaults.STRING;
        const rawValue = attr["raw-value"] ?? defaults.STRING;
        return [`
        INSERT INTO smart_attributes (report_id, title, value, worst, threshold, attr_type, updated, when_failed, raw_value)
        VALUES (${report_id},$1,$2,$3,$4,$5,$6,$7,$8);`,
            [id,value,worst,threshold,type,updated,whenFailed,rawValue]
        ]
    })
}
const smart_parametersQuery = (report_id:number,rawData:any) => {
    const smartParameters = rawData?.smart_parameters;
    if(!smartParameters) return console.warn("SMART PARAMETERS : data not found");
    const deviceModel = smartParameters?.['device-model'] ?? defaults.STRING;
    const firmwareVersion = smartParameters?.['firmware-version'] ?? defaults.STRING;
    const capacity = smartParameters?.capacity ?? defaults.STRING;
    const ataVersion = smartParameters?.['ata-version'] ?? defaults.INT;
    const ataStandard = smartParameters?.['ata-standard'] ?? defaults.STRING;
    const smartSupport = smartParameters?.['smart-support'] ?? defaults.INT;
    const offlineDataCollectionStatus = smartParameters?.['off-line-data-collection-status'] ?? defaults.INT;
    const selfTestExecutionStatus = smartParameters?.['self-test-execution-status'] ?? defaults.INT;
    const timeOfflineDataCollection = smartParameters?.["time-off-line-data-collection"] ?? defaults.INT;
    const offlineDataCollectionCapability = smartParameters?.['off-line-data-collection-capabilities'] ?? defaults.INT;
    const smartCapability = smartParameters?.['smart-capabilities'] ?? defaults.INT;
    const errorLoggingCapability = smartParameters?.['error-logging-capabilities'] ?? defaults.INT;
    const shortSelfTestTime = smartParameters?.['short-self-test-time'] ?? defaults.INT;
    const extendedSelfTestTime = smartParameters?.['extended-self-test-time'] ?? defaults.INT;

    return [`
        INSERT INTO smart_parameters (report_id, device_model, firmware_version, capacity, ata_version, ata_standard, smart_support, offline_data_collection_status, self_test_execution_status, time_offline_data_collection_sec, offline_data_collection_capabilities, smart_capabilities, error_logging_capabilities, short_self_test_time_min, extended_self_test_time_min)
        VALUES (${report_id},$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);`,
        [deviceModel,firmwareVersion,capacity,ataVersion,ataStandard,smartSupport,offlineDataCollectionStatus,selfTestExecutionStatus,timeOfflineDataCollection,offlineDataCollectionCapability,smartCapability,errorLoggingCapability,shortSelfTestTime,extendedSelfTestTime]
    ]



}
/**
 * @name buildHardDriveQueryHelper
 * @description Builds the queries for inserting hardrives into the database
 * @description takes in the parsed XML data in the form of a JSON object
 * @param {number} report_id
 * @param {JSON} parsedXMLData
 * @returns {Array} Array of queries and values to be inserted into the database
 */
function buildHardDriveQueryHelper (report_id:number,parsedXMLData:any) {
    const device = parsedXMLData?.device;
    try {
        let queries = [
            eraseQuery(report_id,parsedXMLData),
            deviceQuery(report_id,parsedXMLData),
            resultsQuery(report_id,parsedXMLData),
            errorQuery(report_id,parsedXMLData),
            killDiskQuery(report_id,parsedXMLData),
            sysInfoQuery(report_id,parsedXMLData),
        ];
        if(device){
            let smartAttr = device['smart-attributes']
            if(smartAttr){
                let smartAttr = smart_AttributesQuery(report_id,device)
                if(Array.isArray(smartAttr)){
                    queries.push(...smartAttr)
                }
            }
            if(device?.["smart-parameters"]){
                queries.push(smart_parametersQuery(report_id,device))
            }
        }
        return queries.filter((query:any)=>query !== undefined)
    } catch (error) {
        console.error(error);
        return error;
    }
}

export default buildHardDriveQueryHelper;