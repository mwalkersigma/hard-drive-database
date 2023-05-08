CREATE TABLE sysinfo (
    report_id INT REFERENCES report(report_id),
    os VARCHAR(32),
    platform VARCHAR(32),
    kernel VARCHAR(255),
    admin_rights VARCHAR(5),
    hostname VARCHAR(16)
);


-- Sysinfo table
INSERT INTO sysinfo (report_id, os, platform, kernel, admin_rights, hostname)
VALUES (1, 'Linux Mint 20.3', '64-bit', '5.4.0-122-generic (linux)', 'true', 'mint');
