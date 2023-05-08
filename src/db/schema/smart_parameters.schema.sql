CREATE TABLE smart_parameters
(
    report_id                            bigint NOT NULL,
    device_model                         varchar(255) NOT NULL,
    firmware_version                     varchar(255) NOT NULL,
    capacity                             varchar(255) NOT NULL,
    ata_version                          int NOT NULL,
    ata_standard                         varchar(255) NOT NULL,
    smart_support                        int NOT NULL,
    offline_data_collection_status       int NOT NULL,
    self_test_execution_status           int NOT NULL,
    time_offline_data_collection_sec     int NOT NULL,
    offline_data_collection_capabilities int NOT NULL,
    smart_capabilities                   int NOT NULL,
    error_logging_capabilities           int NOT NULL,
    short_self_test_time_min             int NOT NULL,
    extended_self_test_time_min          int NOT NULL REFERENCES report ( report_id )
);

INSERT INTO smart_parameters (report_id, device_model,firmware_version, capacity, ata_version, ata_standard, smart_support, offline_data_collection_status, self_test_execution_status, time_offline_data_collection_sec, offline_data_collection_capabilities, smart_capabilities, error_logging_capabilities, short_self_test_time_min, extended_self_test_time_min)
VALUES (1, 'WD Blue', '02.01C02', '2 TB', 8, 'ACS-2', 1, 1, 1, 3600, 30, 1, 1, 1, 1);
