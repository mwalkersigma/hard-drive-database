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
            customer:"",
            file_name : "",
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
                ignore_lock:"",
                ignore_read:"",
                ignore_write:"",
            },
            kill_disk:{
                process_integrity:"",
                fingerprint:"",
                write:"",
                disk_init:"",
                range_first:"",
                range_total:"",
            },
            results:{
                start_at:"",
                duration:"",
                process_name:"",
                process_errors:"",
                process_results:""
            },
            smart_attributes:{
                title:"",
                value:"",
                worst:"",
                threshold:"",
                attr_type:"",
                updated:"",
                when_failed:"",
                raw_value:"",
            },
            smart_parameters:{
                device_model:"",
                firmware_version:"",
                capacity:"",
                ata_version:"",
                ata_standard:"",
                smart_support:"",
                offline_data_collection_status:"",
                self_test_execution_status:"",
                time_offline_data_collection_sec:"",
                offline_data_collection_capabilities:"",
                smart_capabilities:"",
                error_logging_capabilities:"",
                short_self_test_time_min:"",
                extended_self_test_time_min:"",
            },
            tasks:[]
        }

        template.created = formattedJson.report.created;
        template.provider = formattedJson.report.provider;
        template.kernel_version = formattedJson.report['kernel-version'];
        template.conclusion.value = formattedJson.report.conclusion;
        template.errors.lock_source = formattedJson.report.errors['locksource'];
        template.errors.retries = formattedJson.report.errors['retries'];
        template.errors.error_limit = formattedJson.report.errors['errorLimit'];
        template.errors.skip = formattedJson.report.errors['skip'];
        template.errors.timeout = formattedJson.report.errors['timeout'];
        template.errors.terminate = formattedJson.report.errors['terminate'];
        template.errors.ignore_lock = formattedJson.report.errors.ignore['lock'];
        template.errors.ignore_read = formattedJson.report.errors.ignore['read'];
        template.errors.ignore_write = formattedJson.report.errors.ignore['write'];

        template.results.start_at = formattedJson.report.started["Started at"];
        template.results.duration = formattedJson.report.elapsed["Duration"];
        template.results.process_name = "Batch Erase";
        template.results.process_errors = "N/A";
        template.results.process_results = "N/A";

        let testBay = formattedJson.report['bays']['bay'][i];
        template.title = testBay.title;

        template.device.title.Name = testBay.device.title["Name"];
        template.device["serial-number"]["Serial Number"] = testBay.device['serial-number']['Serial Number'];
        template.device.platformname["Platform Name"] = testBay.device['platformname']['Platform Name'];
        template.device.product["Product Name"] = testBay.device['product']['Product Name'];
        template.device.type.type = testBay.device['type']['Type'];
        template.device.revision["Product Revision"] = "N/A";
        template.device.geometry.partitioning.Partitioning = testBay.device.geometry['partitioning']['Partitioning'];
        template.device.geometry["total-sec"]["Total Sectors"] = testBay.device.geometry['total-sec']['Total Sectors'];
        template.device.geometry["first-sec"]["First Sector"] = testBay.device.geometry['first-sec']['First Sector'];
        template.device.geometry.bps["Bytes per Sector"] = testBay.device.geometry['bps']['Bytes per Sector'];

        template.smart_parameters.device_model = testBay.device['smart-parameters']['Device Model'];
        template.smart_parameters.firmware_version = testBay.device['smart-parameters']['Firmware Version'];
        template.smart_parameters.capacity = testBay.device['smart-parameters']['Capacity'];
        template.smart_parameters.ata_version = testBay.device['smart-parameters']['ATA Version'];
        template.smart_parameters.ata_standard = testBay.device['smart-parameters']['ATA Standard'];
        template.smart_parameters.smart_support = testBay.device['smart-parameters']['SMART Support'];
        template.smart_parameters.offline_data_collection_status = testBay.device['smart-parameters']['Off-line Data Collection Status'];
        template.smart_parameters.self_test_execution_status = testBay.device['smart-parameters']['Self-test Execution Status'];
        template.smart_parameters.time_offline_data_collection_sec = testBay.device['smart-parameters']['Time Off-line Data Collection, sec'];
        template.smart_parameters.offline_data_collection_capabilities = testBay.device['smart-parameters']['Off-line Data Collection Capabilities'];
        template.smart_parameters.smart_capabilities = testBay.device['smart-parameters']['SMART Capabilities'];
        template.smart_parameters.error_logging_capabilities = testBay.device['smart-parameters']['Error Logging Capabilities'];
        template.smart_parameters.short_self_test_time_min = testBay.device['smart-parameters']['Short Self-test Time, min'];
        template.smart_parameters.extended_self_test_time_min = testBay.device['smart-parameters']['Extended Self-test Time, min'];

        template.smart_attributes = testBay.device['smart-attributes'];

        const tasks: any[] = [];
        testBay.task.forEach((task:any) => {
            let temp = {
                task_title: task.title,
                task_data: task,
            }
            delete temp.task_data.title;
            temp.task_data = JSON.stringify(temp.task_data);
            tasks.push(temp);
        })
        // @ts-ignore
        template.tasks = tasks;
        singleReports.push(template);
    }
    return [batchReport,singleReports,batchTasks]
}


export default makeReportsFromBatch;