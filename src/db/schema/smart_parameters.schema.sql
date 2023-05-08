CREATE TABLE smart_parameters (
    report_id INT REFERENCES report(report_id),
    device_model VARCHAR(50),
    serial_number VARCHAR(20),
    firmware_version VARCHAR(10),
    capacity VARCHAR(50),
    ata_version INT,
    ata_standard VARCHAR(50),
    smart_support INT,
    offline_data_collection_status INT,
    self_test_execution_status INT,
    time_offline_data_collection_sec INT,
    offline_data_collection_capabilities INT,
    smart_capabilities INT,
    error_logging_capabilities INT,
    short_self_test_time_min INT,
    extended_self_test_time_min INT
);

INSERT INTO smart_parameters (report_id, device_model, serial_number, firmware_version, capacity, ata_version, ata_standard, smart_support, offline_data_collection_status, self_test_execution_status, time_offline_data_collection_sec, offline_data_collection_capabilities, smart_capabilities, error_logging_capabilities, short_self_test_time_min, extended_self_test_time_min)
VALUES (1, 'WD Blue', 'ABC123', '02.01C02', '2 TB', 8, 'ACS-2', 1, 1, 1, 3600, 30, 1, 1, 1, 1);
