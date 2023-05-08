CREATE TABLE conclusion
(
    value           char(250) NOT NULL,
    report_id       bigint NULL REFERENCES report ( report_id ),
    batch_report_id bigint NULL REFERENCES batch_report ( batch_report_id )
);