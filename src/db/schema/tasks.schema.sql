CREATE TABLE tasks
(
    task_id SERIAL PRIMARY KEY,
    task_title     varchar(100) NOT NULL,
    task_data      json NOT NULL,
    report_id      bigint NULL REFERENCES report ( report_id ),
    batch_tasks_id bigint NULL REFERENCES batch_tasks ( batch_tasks_id )
);