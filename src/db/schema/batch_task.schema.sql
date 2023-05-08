CREATE TABLE batch_tasks
(
    batch_tasks_id  bigserial NOT NULL,
    title           varchar(50) NOT NULL,
    data            json NOT NULL,
    batch_report_id bigint NOT NULL,
    CONSTRAINT PK_1 PRIMARY KEY ( batch_tasks_id ),
    CONSTRAINT FK_1 FOREIGN KEY ( batch_report_id ) REFERENCES batch_report ( batch_report_id )
);

CREATE INDEX FK_1 ON batch_tasks
(
    batch_report_id
);