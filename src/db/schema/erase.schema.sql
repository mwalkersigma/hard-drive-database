CREATE TABLE erase (
    report_id INT REFERENCES report(report_id),
    method VARCHAR(50),
    passes INT,
    verification VARCHAR(3)
);


-- Sample data for 'erase' table
INSERT INTO erase (report_id, method, passes, verifacation)
VALUES (1, 'DOD 5220.22-M', 3, 'Yes');