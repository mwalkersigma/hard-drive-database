CREATE TABLE erase
(
    method       varchar(250) NOT NULL,
    passes       int NOT NULL,
    verification varchar(3) NOT NULL,
    report_id    bigint NOT NULL REFERENCES report ( report_id )
);


-- Sample data for 'erase' table
INSERT INTO erase (report_id, method, passes, verification)
VALUES (1, 'DOD 5220.22-M', 3, 'Yes');