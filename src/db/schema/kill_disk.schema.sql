CREATE TABLE kill_disk
(
    process_integrity varchar(100) NOT NULL,
    fingerprint       varchar(100) NOT NULL,
    write             varchar(3) NOT NULL,
    disk_init         varchar(3) NOT NULL,
    range_first       int NOT NULL,
    range_total       varchar(30) NOT NULL,
    report_id         bigint NOT NULL,
    CONSTRAINT FK_4 FOREIGN KEY ( report_id ) REFERENCES report ( report_id )
);

CREATE INDEX FK_1 ON kill_disk
    (
     report_id
        );

-- Sample data for 'kill_disk' table
INSERT INTO kill_disk (report_id, process_integrity, fingerprint, write, disk_init, range_first, range_total)
VALUES (1, 'SHA-256', '0x123456789', 'Yes', 'No', 0, 'All');