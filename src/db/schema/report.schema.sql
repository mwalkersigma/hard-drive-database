--- Data schema
CREATE TABLE report
(
    report_id       bigserial NOT NULL,
    created         varchar(100) NOT NULL,
    provider        varchar(100) NOT NULL,
    kernel_version  varchar(20) NOT NULL,
    title           varchar(100) NOT NULL,
    batch_report_id bigint NOT NULL,
    CONSTRAINT PK_1 PRIMARY KEY ( report_id ),
    CONSTRAINT FK_12 FOREIGN KEY ( batch_report_id ) REFERENCES batch_report ( batch_report_id )
);

CREATE INDEX FK_1 ON report
(batch_report_id);


-- Sample data for 'report' table
INSERT INTO report (created, provider, version, kernel_version, title,batch_report_id)
VALUES ('2023-04-30 12:34:56', 'ACME Corporation', '1.0.0', '5.4.0-104', 'System Report 1',1);
