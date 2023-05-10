--- Data schema
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
