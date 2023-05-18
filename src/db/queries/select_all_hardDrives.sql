SELECT * FROM report
INNER JOIN device ON report.report_id = device.report_id;
