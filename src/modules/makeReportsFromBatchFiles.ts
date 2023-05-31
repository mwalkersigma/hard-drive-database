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
    batchReport.kernel_version = formattedJson.report['kernel_version'];
    batchReport.started = formattedJson.report.started["started_at"];
    batchReport.elapsed = formattedJson.report.elapsed["duration"];
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
                "serial_number":{"serial_number":""},
                "platformname":{"platform_name":""},
                product:{"product_name":""},
                type:{type:""},
                revision:{"product_revision":""},
                geometry:{
                    partitioning:{
                        partitioning:""
                    },
                    'total_sec':{
                        "total_sectors":""
                    },
                    'first_sec':{
                        "first_sector":""
                    },
                    'bps':{
                        "bytes_per_sector":"",
                    }
                },
                smart_attributes:[{
                    "title":"",
                    value:"",
                    worst:"",
                    threshold:"",
                    type:"",
                    updated:"",
                    "when_failed":"",
                    "raw_value":"",
                }],
                smart_parameters:{
                    "device_model":"",
                    "firmware_version":"",
                    capacity:"",
                    "ata_version":"",
                    "ata_standard":"",
                    "smart_support":"",
                    "offline_data_collection_status":"",
                    "self_test_execution_status":"",
                    "time_offline_data_collection":"",
                    "off_line_data_collection_capabilities":"",
                    "smart_capabilities":"",
                    "error_logging_capabilities":"",
                    "short_self_test_time":"",
                    "extended_self_test_time":"",
                }
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
            results:{
                started:{
                    "Started at":""
                },
                elapsed:{
                    "duration":""
                },
                process:{
                    errors:{
                        errors:""
                    },
                    name:{
                        name:""
                    },
                    result:{
                        result:""
                    }
                },
            },
            tasks: []
        }

        template.created = formattedJson.report.created;
        template.provider = formattedJson.report.provider;
        template.kernel_version = formattedJson.report['kernel_version'];
        template.company = formattedJson.report.company;
        template.name = formattedJson.report['name'];



        template.errors.lock_source = formattedJson.report.errors['locksource'];
        template.errors.retries = formattedJson.report.errors['retries'];
        template.errors.error_limit = formattedJson.report.errors['error_limit'];
        template.errors.skip = formattedJson.report.errors['skip'];
        template.errors.timeout = formattedJson.report.errors['timeout'];
        template.errors.terminate = formattedJson.report.errors['terminate'];
        template.errors.ignore.lock = formattedJson.report.errors.ignore['lock'];
        template.errors.ignore.read = formattedJson.report.errors.ignore['read'];
        template.errors.ignore.write = formattedJson.report.errors.ignore['write'];

        template.results.started["Started at"] = formattedJson.report.started["started_at"];
        template.results.elapsed.duration = formattedJson.report.elapsed["duration"];
        template.results.process.name.name = "Batch Erase";
        template.results.process.errors.errors = "N/A";
        template.results.process.result.result = "N/A";

        let testBay = formattedJson.report['bays']['bay'][i];
        template.title = testBay.title;
        template.conclusion.value = testBay.sequence.conclusion;
        template.device.title.Name = testBay.device?.title["name"] ?? defaults.SHORT_STRING;
        template.device["serial_number"]["serial_number"] = testBay.device['serial_number']['serial_number'];
        template.device.platformname["platform_name"] = testBay.device['platformname']['platform_name'];
        template.device.product["product_name"] = testBay.device['product']['product_name'];
        template.device.type.type = testBay.device['type']['type'];
        template.device.revision["product_revision"] = "N/A";
        template.device.geometry.partitioning.partitioning = testBay.device.geometry['partitioning']['partitioning'];
        template.device.geometry["total_sec"]["total_sectors"] = testBay.device.geometry['total_sec']['total_sectors'];
        template.device.geometry["first_sec"]["first_sector"] = testBay.device.geometry['first_sec']['first_sector'];
        template.device.geometry.bps["bytes_per_sector"] = testBay.device.geometry['bps']['bytes_per_Sector'];

        template.device.smart_parameters["device_model"] = testBay.device['smart_parameters']['device_model'];
        template.device.smart_parameters["firmware_version"] = testBay.device['smart_parameters']['firmware_version'];
        template.device.smart_parameters.capacity = testBay.device['smart_parameters']['capacity'];
        template.device.smart_parameters["ata_version"] = testBay.device['smart_parameters']['ata_version'];
        template.device.smart_parameters["ata_standard"] = testBay.device['smart_parameters']['ata_standard'];
        template.device.smart_parameters["smart_support"] = testBay.device['smart_parameters']['smart_support'];
        template.device.smart_parameters["offline_data_collection_status"] = testBay.device['smart_parameters']['off_line_data_collection_status'];
        template.device.smart_parameters["self_test_execution_status"] = testBay.device['smart_parameters']['self_test_execution_status'];
        template.device.smart_parameters["time_offline_data_collection"] = testBay.device['smart_parameters']['time_off_line_data_collection_sec'];
        template.device.smart_parameters["off_line_data_collection_capabilities"] = testBay.device['smart_parameters']['off_line_data_collection_capabilities'];
        template.device.smart_parameters["smart_capabilities"] = testBay.device['smart_parameters']['smart_capabilities'];
        template.device.smart_parameters["error_logging_capabilities"] = testBay.device['smart_parameters']['error_logging_capabilities'];
        template.device.smart_parameters["short_self_test_time"] = testBay.device['smart_parameters']['short_self_test_time_min'];
        template.device.smart_parameters["extended_self_test_time"] = testBay.device['smart_parameters']['extended_self_test_time_min'];

        template.device.smart_attributes = testBay.device['smart_attributes'];
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
