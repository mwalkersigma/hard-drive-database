CREATE TABLE batch_report
(
    batch_report_id bigserial NOT NULL PRIMARY KEY,
    created         date NOT NULL,
    provider        varchar(50) NOT NULL,
    version         varchar(50) NOT NULL,
    kernel_version  varchar(50) NOT NULL,
    started         date NOT NULL,
    elapsed         date NOT NULL,
    "result"        text NOT NULL
);

CREATE TABLE batch_tasks
(
    batch_tasks_id  bigserial NOT NULL PRIMARY KEY,
    title           varchar(50) NOT NULL,
    data            json NOT NULL,
    batch_report_id bigint NULL REFERENCES batch_report ( batch_report_id )
);
CREATE TABLE report
(
    report_id       bigserial NOT NULL PRIMARY KEY,
    created         varchar(100) NOT NULL,
    provider        varchar(100) NOT NULL,
    kernel_version  varchar(20) NOT NULL,
    title           varchar(100) NOT NULL,
    customer        varchar(100) NULL,
    file_name varchar(250),
    batch_report_id bigint NULL REFERENCES batch_report ( batch_report_id )
);
CREATE TABLE conclusion
(
    value           char(250) NOT NULL,
    report_id       bigint NULL REFERENCES report ( report_id ),
    batch_report_id bigint NULL REFERENCES batch_report ( batch_report_id )
);

CREATE TABLE device
(
    name             varchar(20) NOT NULL,
    serial_number    varchar(20) NOT NULL,
    platform_name    varchar(50) NOT NULL,
    product_name     varchar(50) NOT NULL,
    type             varchar(20) NOT NULL,
    product_revision varchar(10) NOT NULL,
    partitioning     varchar(50) NOT NULL,
    total_sectors    varchar(20) NOT NULL,
    first_sector     int NOT NULL,
    bytes_per_sector int NOT NULL,
    report_id        bigint NOT NULL REFERENCES report ( report_id )
);



CREATE TABLE erase
(
    method       varchar(250) NOT NULL,
    passes       int NOT NULL,
    verification varchar(3) NOT NULL,
    report_id    bigint NOT NULL REFERENCES report ( report_id )
);

CREATE TABLE errors
(
    lock_source     varchar(3) NOT NULL,
    retries         int NOT NULL,
    error_limit     int NOT NULL,
    skip            int NOT NULL,
    timeout         int NOT NULL,
    terminate       varchar(20) NOT NULL,
    ignore_lock     varchar(3) NOT NULL,
    ignore_read     varchar(3) NOT NULL,
    ignore_write    varchar(3) NOT NULL,
    report_id       bigint NULL REFERENCES report ( report_id ),
    batch_report_id bigint NULL REFERENCES batch_report ( batch_report_id )
);

CREATE TABLE kill_disk
(
    process_integrity varchar(100) NOT NULL,
    fingerprint       varchar(100) NOT NULL,
    write             varchar(3) NOT NULL,
    disk_init         varchar(3) NOT NULL,
    range_first       int NOT NULL,
    range_total       varchar(30) NOT NULL,
    report_id         bigint NOT NULL REFERENCES report ( report_id )
);

CREATE TABLE results
(
    start_at        varchar(255) NOT NULL,
    duration        varchar(255) NOT NULL,
    process_name    varchar(255) NOT NULL,
    process_errors   varchar(255) NOT NULL,
    process_results varchar(255) NOT NULL,
    report_id       bigint NOT NULL REFERENCES report ( report_id )

);



CREATE TABLE smart_attributes
(
    report_id   bigint NOT NULL REFERENCES report ( report_id ),
    title       varchar(50) NOT NULL,
    value       int NOT NULL,
    worst       int NOT NULL,
    threshold   int NOT NULL,
    attr_type   varchar(20) NOT NULL,
    updated     varchar(10) NOT NULL,
    when_failed varchar(10) NOT NULL,
    raw_value   varchar(50) NOT NULL
);



CREATE TABLE smart_parameters
(
    report_id                            bigint NOT NULL REFERENCES report ( report_id ),
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
    extended_self_test_time_min          int NOT NULL
);



CREATE TABLE sys_info
(
    report_id    bigint NOT NULL REFERENCES report ( report_id ),
    os           varchar(255) NOT NULL,
    platform     varchar(255) NOT NULL,
    kernel       varchar(255) NOT NULL,
    admin_rights varchar(255) NOT NULL,
    hostname     varchar(255) NOT NULL
);



CREATE TABLE tasks
(
    task_id SERIAL PRIMARY KEY,
    task_title     varchar(100) NOT NULL,
    task_data      json NOT NULL,
    report_id      bigint NULL REFERENCES report ( report_id ),
    batch_tasks_id bigint NULL REFERENCES batch_tasks ( batch_tasks_id )
);