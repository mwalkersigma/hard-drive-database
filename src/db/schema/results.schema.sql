CREATE TABLE results (
    report_id INT REFERENCES report(report_id),
    start_at VARCHAR(25),
    duration VARCHAR(9),
    process_name VARCHAR(32),
    process_errors VARCHAR(22),
    process_results VARCHAR(22),
    conclusion VARCHAR(255)
);
-- Results table
INSERT INTO results (report_id, start_at, duration, process_name, process_errors, process_results)
VALUES (1, '16/08/2022 10:00:37', '00:55:06', 'Erasing sda', 'No Errors', 'Erased');
