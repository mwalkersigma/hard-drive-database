CREATE TABLE sys_info
(
    report_id    bigint NOT NULL,
    os           varchar(255) NOT NULL,
    platform     varchar(255) NOT NULL,
    kernel       varchar(255) NOT NULL,
    admin_rights varchar(255) NOT NULL,
    hostname     varchar(255) NOT NULL,
    CONSTRAINT FK_10 FOREIGN KEY ( report_id ) REFERENCES report ( report_id )
);

CREATE INDEX FK_1 ON sys_info
    (
     report_id
        );