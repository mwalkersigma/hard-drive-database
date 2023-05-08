CREATE TABLE smart_attributes
(
    report_id   bigint NOT NULL,
    title       varchar(50) NOT NULL,
    value       int NOT NULL,
    worst       int NOT NULL,
    threshold   int NOT NULL,
    attr_type   varchar(20) NOT NULL,
    updated     varchar(10) NOT NULL,
    when_failed varchar(10) NOT NULL,
    raw_value   varchar(50) NOT NULL,
    CONSTRAINT FK_9 FOREIGN KEY ( report_id ) REFERENCES report ( report_id )
);

CREATE INDEX FK_1 ON smart_attributes
    (
     report_id
        );

INSERT INTO smart_attributes (report_id, title, value, worst, threshold, attr_type, updated, when_failed, raw_value)
VALUES (1, 'Raw Read Error Rate', 100, 100, 50, 'Pre-fail', 'Always', '-', '0');

