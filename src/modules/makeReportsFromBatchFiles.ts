import {defaults} from "./insertQueryBuilder/buildHardDriveQueryHelper";

function makeReportsFromBatch(formattedJson:any){
    let batchReport = {
        created: "",
        provider: "",
        version: "",
        kernel_version: "",
        started: "",
        elapsed: "",
        result: ""
    }

    batchReport.created = formattedJson.report.created;
    batchReport.provider = formattedJson.report.provider;
    batchReport.version = formattedJson.report?.version ?? "N/A";
    batchReport.kernel_version = formattedJson.report['kernel-version'];
    batchReport.started = formattedJson.report.started["Started at"];
    batchReport.elapsed = formattedJson.report.elapsed["Duration"];
    batchReport.result = formattedJson.report.conclusion;

    const batchTasks:any[] = [];
    formattedJson.report.task.forEach((task:any) => {
        let temp = {
            task_title: task.title,
            task_data: task,
        }
        delete temp.task_data.title;
        temp.task_data = JSON.stringify(temp.task_data);
        batchTasks.push(temp);
    });

    let singleReports = [];
    for (let i = 0; i < formattedJson.report["bays"]["bay"].length; i++) {
        let template = {
            created: "",
            provider: "",
            kernel_version: "",
            title: "",
            company:"",
            name : "",
            conclusion:{
                value:"",
            },
            device:{
                title:{Name:""},
                "serial-number":{"Serial Number":""},
                "platformname":{"Platform Name":""},
                product:{"Product Name":""},
                type:{type:""},
                revision:{"Product Revision":""},
                geometry:{
                    partitioning:{
                        Partitioning:""
                    },
                    'total-sec':{
                        "Total Sectors":""
                    },
                    'first-sec':{
                        "First Sector":""
                    },
                    'bps':{
                        "Bytes per Sector":""
                    }
                },
            },
            erase:{
                method:"",
                passes:"",
                verification:"",
            },
            errors:{
                lock_source:"",
                retries:"",
                error_limit:"",
                skip:"",
                timeout:"",
                terminate:"",
                ignore:{
                    lock:"",
                    read:"",
                    write:""
                }
            },
            kill_disk:{
                ["process-integrity"]:"",
                fingerprint:{
                    write:"",
                    value:"",
                },
                initialize:"",
                range:{
                    first:"",
                    total:"",
                }
            },
            results:{
                started:{
                    "Started at":""
                },
                elapsed:{
                    "Duration":""
                },
                process:{
                    errors:{
                        Errors:""
                    },
                    name:{
                        Name:""
                    },
                    result:{
                        Result:""
                    }
                },
            },
            smart_attributes:{
                "@title":"",
                value:"",
                worst:"",
                threshold:"",
                type:"",
                updated:"",
                "when-failed":"",
                "raw-value":"",
            },
            smart_parameters:{
                "device-model":"",
                "firmware-version":"",
                capacity:"",
                "ata-version":"",
                "ata-standard":"",
                "smart-support":"",
                "offline-data-collection-status":"",
                "self-test-execution-status":"",
                "time-offline-data-collection":"",
                "off-line-data-collection-capabilities":"",
                "smart-capabilities":"",
                "error-logging-capabilities":"",
                "short-self-test-time":"",
                "extended-self-test-time":"",
            },
            tasks: []
        }

        template.created = formattedJson.report.created;
        template.provider = formattedJson.report.provider;
        template.kernel_version = formattedJson.report['kernel-version'];
        template.company = formattedJson.report.company;
        template.name = formattedJson.report['name'];
        template.conclusion.value = formattedJson.report.conclusion;
        template.errors.lock_source = formattedJson.report.errors['locksource'];
        template.errors.retries = formattedJson.report.errors['retries'];
        template.errors.error_limit = formattedJson.report.errors['errorLimit'];
        template.errors.skip = formattedJson.report.errors['skip'];
        template.errors.timeout = formattedJson.report.errors['timeout'];
        template.errors.terminate = formattedJson.report.errors['terminate'];
        template.errors.ignore.lock = formattedJson.report.errors.ignore['lock'];
        template.errors.ignore.read = formattedJson.report.errors.ignore['read'];
        template.errors.ignore.write = formattedJson.report.errors.ignore['write'];

        template.results.started["Started at"] = formattedJson.report.started["Started at"];
        template.results.elapsed.Duration = formattedJson.report.elapsed["Duration"];
        template.results.process.name.Name = "Batch Erase";
        template.results.process.errors.Errors = "N/A";
        template.results.process.result.Result = "N/A";

        let testBay = formattedJson.report['bays']['bay'][i];
        template.title = testBay.title;

        template.device.title.Name = testBay.device?.title["Name"] ?? defaults.SHORT_STRING;
        template.device["serial-number"]["Serial Number"] = testBay.device['serial-number']['Serial Number'];
        template.device.platformname["Platform Name"] = testBay.device['platformname']['Platform Name'];
        template.device.product["Product Name"] = testBay.device['product']['Product Name'];
        template.device.type.type = testBay.device['type']['Type'];
        template.device.revision["Product Revision"] = "N/A";
        template.device.geometry.partitioning.Partitioning = testBay.device.geometry['partitioning']['Partitioning'];
        template.device.geometry["total-sec"]["Total Sectors"] = testBay.device.geometry['total-sec']['Total Sectors'];
        template.device.geometry["first-sec"]["First Sector"] = testBay.device.geometry['first-sec']['First Sector'];
        template.device.geometry.bps["Bytes per Sector"] = testBay.device.geometry['bps']['Bytes per Sector'];

        template.smart_parameters["device-model"] = testBay.device['smart-parameters']['Device Model'];
        template.smart_parameters["firmware-version"] = testBay.device['smart-parameters']['Firmware Version'];
        template.smart_parameters.capacity = testBay.device['smart-parameters']['Capacity'];
        template.smart_parameters["ata-version"] = testBay.device['smart-parameters']['ATA Version'];
        template.smart_parameters["ata-standard"] = testBay.device['smart-parameters']['ATA Standard'];
        template.smart_parameters["smart-support"] = testBay.device['smart-parameters']['SMART Support'];
        template.smart_parameters["offline-data-collection-status"] = testBay.device['smart-parameters']['Off-line Data Collection Status'];
        template.smart_parameters["self-test-execution-status"] = testBay.device['smart-parameters']['Self-test Execution Status'];
        template.smart_parameters["time-offline-data-collection"] = testBay.device['smart-parameters']['Time Off-line Data Collection, sec'];
        template.smart_parameters["off-line-data-collection-capabilities"] = testBay.device['smart-parameters']['Off-line Data Collection Capabilities'];
        template.smart_parameters["smart-capabilities"] = testBay.device['smart-parameters']['SMART Capabilities'];
        template.smart_parameters["error-logging-capabilities"] = testBay.device['smart-parameters']['Error Logging Capabilities'];
        template.smart_parameters["short-self-test-time"] = testBay.device['smart-parameters']['Short Self-test Time, min'];
        template.smart_parameters["extended-self-test-time"] = testBay.device['smart-parameters']['Extended Self-test Time, min'];

        template.smart_attributes = testBay.device['smart-attributes'];
        const tasks: {title:string,data:any}[] = [];
        testBay.task.forEach((task:any) => {
            let temp = {
                title: task.title,
                data: task,
            }
            delete temp.data.title;
            temp.data = JSON.stringify(temp.data);
            tasks.push(temp);
        })
        // @ts-ignore
        template.tasks = tasks;
        singleReports.push(template);
    }
    return [batchReport,singleReports,batchTasks]
}


export default makeReportsFromBatch;
