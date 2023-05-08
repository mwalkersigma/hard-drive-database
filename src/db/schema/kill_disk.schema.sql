CREATE TABLE kill_disk (
                           report_id INT REFERENCES report(report_id),
                           process_integrity VARCHAR(50),
                           fingerprint VARCHAR(100),
                           write VARCHAR(3),
                           diskinit VARCHAR(3),
                           range_first INT,
                           range_total VARCHAR(20)
);

-- Sample data for 'kill_disk' table
INSERT INTO kill_disk (report_id, process_integrity, fingerprint, write, diskinit, range_first, range_total)
VALUES (1, 'SHA-256', '0x123456789', 'Yes', 'No', 0, 'All');