CREATE TABLE batch_report
(
    batch_report_id bigserial NOT NULL PRIMARY KEY,
    created         date NOT NULL,
    provider        varchar(50) NOT NULL,
    version         varchar(50) NOT NULL,
    kernel_version  varchar(50) NOT NULL,
    started         date NOT NULL,
    elapsed         date NOT NULL,
    "result"        text NOT NULL
);
