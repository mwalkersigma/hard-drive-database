CREATE TABLE conclusion
(
    value           char(250) NOT NULL,
    report_id       bigint NULL,
    batch_report_id bigint NULL,
    CONSTRAINT FK_14_1 FOREIGN KEY ( report_id ) REFERENCES report ( report_id ),
    CONSTRAINT FK_15 FOREIGN KEY ( batch_report_id ) REFERENCES batch_report ( batch_report_id )
);

CREATE INDEX FK_1 ON conclusion
    (
     report_id
        );

CREATE INDEX FK_2 ON conclusion
    (
     batch_report_id
        );