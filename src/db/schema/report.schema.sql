--- Data schema
CREATE TABLE report
(
    report_id       bigserial NOT NULL PRIMARY KEY,
    created         varchar(100) NOT NULL,
    provider        varchar(100) NOT NULL,
    kernel_version  varchar(20) NOT NULL,
    title           varchar(100) NOT NULL,
    file_name varchar(250),
    batch_report_id bigint NULL REFERENCES batch_report ( batch_report_id )
);


-- Sample data for 'report' table
INSERT INTO report (created, provider, kernel_version, title,batch_report_id)
VALUES ('2023-04-30 12:34:56', 'ACME Corporation', '5.4.0-104', 'System Report 1',1);
