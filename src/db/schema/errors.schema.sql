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
    report_id       bigint NULL,
    batch_report_id bigint NULL,
    CONSTRAINT FK_5 FOREIGN KEY ( report_id ) REFERENCES report ( report_id ),
    CONSTRAINT FK_13_1 FOREIGN KEY ( batch_report_id ) REFERENCES batch_report ( batch_report_id )
);

CREATE INDEX FK_1 ON errors
    (
     report_id
        );

CREATE INDEX FK_2 ON errors
    (
     batch_report_id
        );

-- Sample data for 'errors' table
INSERT INTO errors (report_id, lock_source, retries, error_limit, skip, timeout, terminate, ignore_lock, ignore_read, ignore_write)
VALUES (1, 'Yes', 10, 5, 2, 30, 'Yes', 'No', 'Yes', 'No');