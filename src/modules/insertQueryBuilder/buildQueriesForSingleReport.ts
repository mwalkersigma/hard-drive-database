const defaultString:string = "not specified";

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

interface reportData {
    device: deviceData;
    results: resultsData;
    sysinfo: sys_infoData;
    erase: EraseData;
    killDisk: KillDiskData;
    errors: ErrorData;
}
/**

 Generates a SQL query and parameter values to insert erase data into a database.
 @param {number} report_id - The ID of the report associated with the erase data.
 @param {Object} rawData - An object containing the erase data, with the following properties:
 @property {string | null} method - The method used for erasing data.
 @property {string | null} passes - The number of passes used for erasing data.
 @property {string | null} verification - The verification method used after erasing data.
 @returns {Array} - An array containing the SQL query and parameter values to insert the erase data.
 @returns {string} - The SQL query string with placeholders for the parameter values.
 @returns {Array} - An array of the parameter values to be inserted into the SQL query.
 @throws {Error} - If erase data is not found in the rawData object.
 */
const eraseQuery = (report_id:number,rawData:{erase:EraseData}) => {
    const data = rawData?.erase;
    if(!data) throw new Error("Erase data not found");
    const method = data?.method  ?? defaultString;
    const passes  = data?.passes ?? defaultString
    const verification = data?.verification ?? defaultString;
    let query =
        `INSERT INTO erase ( report_id, method, passes, verification) VALUES (${report_id}, $1, $2, $3)`;
    let values = [method,passes,verification];
    return [query,values];
};

const killDiskQuery = (report_id:number,rawData:{ killDisk:KillDiskData }) => {
    const killDisk = rawData?.killDisk;
    if(!killDisk) throw new Error("KillDisk data not found");
    const processIntegrity = killDisk?.['process-integrity'] ?? defaultString;
    const fingerprintWrite = killDisk?.fingerprint?.write ?? defaultString;
    const fingerprintValue = killDisk?.fingerprint?.value ?? defaultString;
    const rangeFirst = killDisk?.range?.first ?? defaultString;
    const rangeTotal = killDisk?.range?.total ?? defaultString;
    const initialize = killDisk?.initialize ?? defaultString;
    let query =
        `INSERT INTO kill_disk ( report_id, process_integrity, fingerprint, write, range_first, range_total, disk_init) 
         VALUES (${report_id}, $1, $2, $3, $4, $5, $6)`;
    let values = [processIntegrity,fingerprintValue,fingerprintWrite,rangeFirst,rangeTotal,initialize];
    return [query,values];
}

const errorQuery = (report_id:number,rawData:{ errors:ErrorData }) => {
    const errorData = rawData?.errors;
    if(!errorData) throw new Error("Error data not found");
    const lockSource = errorData?.lock_source ?? defaultString;
    const retries = errorData?.retries ?? defaultString;
    const errorLimit = errorData?.errorLimit ?? defaultString;
    const skip = errorData?.skip ?? defaultString;
    const timeout = errorData?.timeout ?? defaultString;
    const terminate = errorData?.terminate ?? defaultString;
    const ignoreLock = errorData?.ignore?.lock ?? defaultString;
    const ignoreRead = errorData?.ignore?.read ?? defaultString;
    const ignoreWrite = errorData?.ignore?.write ?? defaultString;
    let query =
        `INSERT INTO errors ( report_id, lock_source, retries, error_limit, skip, timeout, terminate, ignore_lock, ignore_read, ignore_write)
            VALUES (${report_id}, $1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    let values = [lockSource,retries,errorLimit,skip,timeout,terminate,ignoreLock,ignoreRead,ignoreWrite];
    return [query,values];
}

const deviceQuery = (report_id:number,rawData:{ device:deviceData }) => {
    const device = rawData?.device;
    if(!device) throw new Error("Device data not found");
    const title = device?.title?.name ?? defaultString;
    const serialNumber = device?.['serial-number']?.['serial number'] ?? defaultString;
    const platformName = device?.platformname?.['platform name'] ?? defaultString;
    const productName = device?.product?.['product name'] ?? defaultString;
    const type = device?.type?.Type ?? defaultString;
    const revision = device?.revision?.['Product Revision'] ?? defaultString;
    const partitioning = device?.geometry?.partitioning?.Partitioning ?? defaultString;
    const totalSectors = device?.geometry?.['total-sec']?.['Total Sectors'] ?? defaultString;
    const firstSector = device?.geometry?.['first-sec']?.['First Sector'] ?? defaultString;
    const bytesPerSector = device?.geometry?.bps?.['Bytes Per Sector'] ?? defaultString;
    let query =
        `INSERT INTO device ( report_id, name, serial_number, platform_name, product_name, type, product_revision, partitioning, total_sectors, first_sector, bytes_per_sector)
            VALUES (${report_id}, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    let values = [title,serialNumber,platformName,productName,type,revision,partitioning,totalSectors,firstSector,bytesPerSector];
    return [query,values];
}

const resultsQuery = (report_id:number,rawData:{ results:resultsData }) => {
    const results = rawData?.results;
    if(!results) throw new Error("Results data not found");
    const startedAt = results?.started["Started at"] ?? defaultString;
    const duration = results?.elapsed?.Duration ?? defaultString;
    const errors = results?.process.errors?.Errors ?? defaultString;
    const name = results?.process.name ?? defaultString;
    const result = results?.process.result ?? defaultString;
    const queryString =
        `INSERT INTO results ( report_id, start_at, duration, process_errors, process_name, process_results)
        VALUES (${report_id}, $1, $2, $3, $4, $5)`;
    const queryValues = [startedAt,duration,errors,name,result];
    return [queryString,queryValues];
}

const sysInfoQuery = (report_id:number,rawData:{ sysinfo:sys_infoData }) => {
    const sysInfo = rawData?.sysinfo;
    if(!sysInfo) throw new Error("SysInfo data not found");
    const os = sysInfo?.os ?? defaultString;
    const platform = sysInfo?.platform ?? defaultString;
    const kernel = sysInfo?.kernel ?? defaultString;
    const adminRights = sysInfo?.['admin-rights'] ?? defaultString;
    const hostname = sysInfo?.hostname ?? defaultString;
    const queryString =
        `INSERT INTO sys_info ( report_id, os,platform, kernel,admin_rights,hostname)
        VALUES (${report_id}, $1, $2, $3)`;
    const queryValues = [os,platform,kernel,adminRights,hostname];
    return [queryString,queryValues];
}

const smart_AttributesQuery = (report_id:number,rawData:{ 'smart_attributes':smartAttributesData }) => {
    const smartAttributes = rawData?.smart_attributes;
    if(!smartAttributes) throw new Error("Smart Attributes data not found");
    return smartAttributes.attr.map(attr => {
        const id = attr['@title'] ?? "";
        const value = attr.value ?? "";
        const worst = attr.worst ?? "";
        const threshold = attr.threshold ?? "";
        const type = attr.type ?? "";
        const updated = attr.updated ?? "";
        const whenFailed = attr["when-failed"] ?? "";
        const rawValue = attr["raw-value"] ?? "";
        return [`
        INSERT INTO smart_attributes (report_id, title, value, worst, threshold, attr_type, updated, when_failed, raw_value)
        VALUES (${report_id},$1,$2,$3,$4,$5,$6,$7,$8,$9);`,
                [id,name,value,worst,threshold,type,updated,whenFailed,rawValue]
            ]
        })
}

const smart_parametersQuery = (report_id:number,rawData:{ 'smart_parameters':smartParametersData }) => {
    const smartParameters = rawData?.smart_parameters;
    if(!smartParameters) throw new Error("Smart Parameters data not found");
    const deviceModel = smartParameters?.['device-model'] ?? defaultString;
    const firmwareVersion = smartParameters?.['firmware-version'] ?? defaultString;
    const capacity = smartParameters?.capacity ?? defaultString;
    const ataVersion = smartParameters?.['ata-version'] ?? defaultString;
    const ataStandard = smartParameters?.['ata-standard'] ?? defaultString;
    const smartSupport = smartParameters?.['smart-support'] ?? defaultString;
    const offlineDataCollectionStatus = smartParameters?.['off-line-data-collection-status'] ?? defaultString;
    const selfTestExecutionStatus = smartParameters?.['self-test-execution-status'] ?? defaultString;
    const timeOfflineDataCollection = smartParameters?.["time-off-line-data-collection"] ?? defaultString;
    const offlineDataCollectionCapability = smartParameters?.['off-line-data-collection-capabilities'] ?? defaultString;
    const smartCapability = smartParameters?.['smart-capabilities'] ?? defaultString;
    const errorLoggingCapability = smartParameters?.['error-logging-capabilities'] ?? defaultString;
    const shortSelfTestTime = smartParameters?.['short-self-test-time'] ?? defaultString;
    const extendedSelfTestTime = smartParameters?.['extended-self-test-time'] ?? defaultString;

    return [`
        INSERT INTO smart_parameters (report_id, device_model, firmware_version, capacity, ata_version, ata_standard, smart_support, offline_data_collection_status, self_test_execution_status, time_offline_data_collection_sec, offline_data_collection_capabilities, smart_capabilities, error_logging_capabilities, short_self_test_time_min, extended_self_test_time_min)
        VALUES (${report_id},$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);`,
            [deviceModel,firmwareVersion,capacity,ataVersion,ataStandard,smartSupport,offlineDataCollectionStatus,selfTestExecutionStatus,timeOfflineDataCollection,offlineDataCollectionCapability,smartCapability,errorLoggingCapability,shortSelfTestTime,extendedSelfTestTime]
        ]



}

/**
 * @name buildQueriesForSingleReport
 * @description Builds the queries for inserting hardrives into the database
 * @description takes in the parsed XML data in the form of a JSON object
 * @param {number} report_id
 * @param {JSON} parsedXMLData
 * @returns {Array} Array of queries and values to be inserted into the database
 */
function buildQueriesForSingleReport (report_id:number,parsedXMLData:reportData) {
    const {device} = parsedXMLData;
    try {
        return [
            eraseQuery(report_id,parsedXMLData),
            deviceQuery(report_id,parsedXMLData),
            resultsQuery(report_id,parsedXMLData),
            errorQuery(report_id,parsedXMLData),
            killDiskQuery(report_id,parsedXMLData),
            sysInfoQuery(report_id,parsedXMLData),
            ...smart_AttributesQuery(report_id,device),
            smart_parametersQuery(report_id,device)
        ];
    } catch (error) {
        console.error(error);
        return error;
    }
}

export default buildQueriesForSingleReport;