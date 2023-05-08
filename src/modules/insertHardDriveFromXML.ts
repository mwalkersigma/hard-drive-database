
interface Report {
    created: string;
    provider: string;
    version: string;
    'kernel-version': string;
    title: string;
    erase: {
        method: string;
        passes: string;
        verification: string;
    };
    'kill-disk': {
        'process-integrity': string;
        fingerprint: {
            write: string;
            value: string;
        };
        diskinit: {
            initialize: string;
        };
        range: {
            first: string;
            total: string;
        };
    };
    errors: {
        locksource: string;
        retries: string;
        errorLimit: string;
        skip: string;
        timeout: string;
        terminate: string;
        ignore: {
            lock: string;
            read: string;
            write: string;
        };
    };
    device: {
        title: {
            Name: string;
        };
        'serial-number': {
            'Serial Number': string;
        };
        platformname: {
            'Platform Name': string;
        };
        product: {
            'Product Name': string;
        };
        type: {
            Type: string;
        };
        revision: {
            'Product Revision': string;
        };
        size: {
            Size: string;
        };
        geometry: {
            partitioning: {
                Partitioning: string;
            };
            'total-sec': {
                'Total Sectors': string;
            };
            'first-sec': {
                'First Sector': string;
            };
            bps: {
                'Bytes per Sector': string;
            };
        };
        'smart-parameters': {
            'Device Model': string;
            'Serial Number': string;
            'Firmware Version': string;
            Capacity: string;
            'ATA Version': string;
            'ATA Standard': string;
            'SMART Support': string;
            'Off-line Data Collection Status': string;
            'Self-test Execution Status': string;
            'Time Off-line Data Collection, sec': string;
            'Off-line Data Collection Capabilities': string;
            'SMART Capabilities': string;
            'Error Logging Capabilities': string;
            'Short Self-test Time, min': string;
            'Extended Self-test Time, min': string;
        };
        'smart-attributes': {
            attr: {
                id: string;
                '@title': string;
                value: string;
                worst: string;
                threshold: string;
                type: string;
                updated: string;
                'when-failed': string;
                'raw-value': string;
            }[];
        };
    };
    results: {
        started: {
            'Started at': string;
        };
        elapsed: {
            Duration: string;
        };
        process: {
            name: {
                Name: string;
            };
            started: {
                'Started at': string;
            };
            elapsed: {
                Duration: string;
            };
            errors: {
                Errors: string;
            };
            result: {
                Result: string;
            };
        };
    }
    sysinfo: {
        os: string;
        platform: string;
        kernel: string;
        'admin-rights': string;
        hostname: string;
    };
    conclusion: string;
}

const eraseQuery = (report_id:number,data:Report) => {
    return `
    INSERT into erase (report_id, method, passes, verifacation) 
    VALUES (${report_id},${data.erase.method},${data.erase.passes},${data.erase.verification});
    `
}
const killDiskQuery = (report_id:number,data:Report) => {
    const {
        "process-integrity":p_i,
        "fingerprint":{
            write,
            value
        },
        diskinit:{
            initialize
        },
        range:{
            first,
            total
        }
    } = data?.["kill-disk"];
    return `
    INSERT INTO kill_disk (report_id, process_integrity, fingerprint, write, diskinit, range_first, range_total) 
    VALUES (${report_id},${p_i}, ${value} , ${write}, ${initialize}, ${first}, ${total})
    `
}

const errorsQuery = (report_id:number,data:Report) => {
    const {
        locksource,
        retries,
        errorLimit,
        skip,
        timeout,
        terminate,
        ignore:{
            lock,read,write
        }
    } = data.errors
    return `
    INSERT INTO errors (report_id, locksource, retries, errorlimit, skip, timeout, terminate, ignore_lock, ignore_read, ignore_write)
    VALUES (${report_id},${locksource},${retries},${errorLimit},${skip},${timeout},${terminate},${lock},${read},${write})
    `
};

const deviceQuery = (report_id:number,data:Report) => {
    const {
        title:{
            Name
        },
        "serial-number":{
            "Serial Number":serial
        },
        platformname:{
            "Platform Name":platform
        },
        product:{
            "Product Name":product
        },
        type:{
            Type
        },
        revision:{
            "Product Revision":revision
        },
        size:{
            Size
        },
        geometry:{
            partitioning:{
                Partitioning
            },
            "total-sec":{
                "Total Sectors":total
            },
            "first-sec":{
                "First Sector":first
            },
            bps:{
                "Bytes per Sector":bps
            }

        }
    } = data.device;
    return `
    INSERT INTO device (report_id, name, serial_number, platform_name, product_name, type, product_revision, size, partitioning, total_sectors, first_sector, bytes_per_sector)
    VALUES (${report_id},${Name},${serial},${platform},${product},${Type},${revision},${Size},${Partitioning},${total},${first},${bps})
    `
}

const resultsQuery = (report_id:number,data:Report) => {
    const {
        started:{
            "Started at":started
        },
        elapsed:{
            Duration
        },
        process:{
            name:{
                Name
            },

            errors:{
                Errors
            },
            result:{
                Result
            }
        }
    } = data.results;
    const {conclusion} = data;
    return `
    INSERT INTO results (report_id, start_at, duration, process_name, process_errors, process_results,conclusion)
    VALUES (${report_id},${started},${Duration},${Name},${Errors},${Result},${conclusion});
    `
}

const systemQuery = (report_id:number,data:Report) => {
    const {
        os,
        platform,
        kernel,
        "admin-rights":admin_rights,
        hostname
    } = data.sysinfo;
    return `
    INSERT INTO sysinfo (report_id, os, platform, kernel, admin_rights, hostname)
    VALUES (${report_id},${os},${platform},${kernel},${admin_rights},${hostname})
    `
}

function insertHardDrive(data:Report,db:any){
    let report_id = db.query(`
            INSERT INTO report (created,provider,version,kernel_version,title)
            VALUES ('${data.created}', '${data.provider}', '${data.version}', '${data["kernel-version"]}', '${data.title}')
            RETURNING report_id;
    `);
    db.query(`
    
        ${eraseQuery(report_id, data)}
        
        ${killDiskQuery(report_id, data)}
        
        ${errorsQuery(report_id, data)}     
        
        ${deviceQuery(report_id, data)}
        
        ${resultsQuery(report_id, data)}
          
        ${systemQuery(report_id, data)}

    `)
}

export default insertHardDrive;
