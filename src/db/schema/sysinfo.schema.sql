CREATE TABLE sys_info
(
    report_id    bigint NOT NULL REFERENCES report ( report_id ),
    os           varchar(255) NOT NULL,
    platform     varchar(255) NOT NULL,
    kernel       varchar(255) NOT NULL,
    admin_rights varchar(255) NOT NULL,
    hostname     varchar(255) NOT NULL
);


-- Sysinfo table
INSERT INTO sys_info (report_id, os, platform, kernel, admin_rights, hostname)
VALUES (1, 'Linux Mint 20.3', '64-bit', '5.4.0-122-generic (linux)', 'true', 'mint');
