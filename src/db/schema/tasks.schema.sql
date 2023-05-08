CREATE TABLE tasks
(
    task_title     varchar(100) NOT NULL,
    task_data      json NOT NULL,
    report_id      bigint NULL,
    batch_tasks_id bigint NULL,
    CONSTRAINT PK_1 PRIMARY KEY ( task_id ),
    CONSTRAINT FK_13 FOREIGN KEY ( batch_tasks_id ) REFERENCES batch_tasks ( batch_tasks_id ),
    CONSTRAINT FK_14 FOREIGN KEY ( report_id ) REFERENCES report ( report_id )
);

CREATE INDEX FK_2 ON tasks
    (batch_tasks_id);

CREATE INDEX FK_3 ON tasks
    (report_id);