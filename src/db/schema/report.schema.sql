--- Data schema
CREATE TABLE report (
    report_id SERIAL PRIMARY KEY,
    created VARCHAR(100),
    provider VARCHAR(100),
    version VARCHAR(20),
    kernel_version VARCHAR(20),
    title VARCHAR(100)
);

-- Sample data for 'report' table
INSERT INTO report (created, provider, version, kernel_version, title)
VALUES ('2023-04-30 12:34:56', 'ACME Corporation', '1.0.0', '5.4.0-104', 'System Report 1');
