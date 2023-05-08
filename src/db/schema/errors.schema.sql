CREATE TABLE errors (
                        report_id INT REFERENCES report(report_id),
                        locksource VARCHAR(3),
                        retries INT,
                        errorLimit INT,
                        skip INT,
                        timeout INT,
                        terminate VARCHAR(20),
                        ignore_lock VARCHAR(3),
                        ignore_read VARCHAR(3),
                        ignore_write VARCHAR(3)
);
-- Sample data for 'errors' table
INSERT INTO errors (report_id, locksource, retries, errorLimit, skip, timeout, terminate, ignore_lock, ignore_read, ignore_write)
VALUES (1, 'Yes', 10, 5, 2, 30, 'Yes', 'No', 'Yes', 'No');