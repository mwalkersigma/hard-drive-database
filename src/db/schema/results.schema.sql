CREATE TABLE results
(
    start_at        varchar(255) NOT NULL,
    duration        varchar(255) NOT NULL,
    process_name    varchar(255) NOT NULL,
    process_errors   varchar(255) NOT NULL,
    process_results varchar(255) NOT NULL,
    report_id       bigint NOT NULL,
    CONSTRAINT FK_7 FOREIGN KEY ( report_id ) REFERENCES report ( report_id )
);

CREATE INDEX FK_1 ON results
    (
     report_id
        );
-- Results table
INSERT INTO results (report_id, start_at, duration, process_name, process_errors, process_results)
VALUES (1, '16/08/2022 10:00:37', '00:55:06', 'Erasing sda', 'No Errors', 'Erased');
