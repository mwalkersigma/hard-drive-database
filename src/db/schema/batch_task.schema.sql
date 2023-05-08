CREATE TABLE batch_tasks
(
    batch_tasks_id  bigserial NOT NULL PRIMARY KEY,
    title           varchar(50) NOT NULL,
    data            json NOT NULL,
    batch_report_id bigint NULL REFERENCES batch_report ( batch_report_id )
);