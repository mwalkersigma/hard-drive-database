CREATE TABLE smart_attributes (
    report_id INT REFERENCES report(report_id),
    title VARCHAR(50),
    value INT,
    worst INT,
    threshold INT,
    attr_type VARCHAR(20),
    updated VARCHAR(10),
    when_failed VARCHAR(10),
    raw_value VARCHAR(50)
);

INSERT INTO smart_attributes (report_id, title, value, worst, threshold, attr_type, updated, when_failed, raw_value)
VALUES (1, 'Raw Read Error Rate', 100, 100, 50, 'Pre-fail', 'Always', '-', '0');

