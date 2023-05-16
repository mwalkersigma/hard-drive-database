SELECT * FROM batch_report
INNER JOIN report ON batch_report.batch_report_id = report.batch_report_id
INNER JOIN device d on report.report_id = d.report_id
INNER JOIN batch_tasks bt on batch_report.batch_report_id = bt.batch_report_id
INNER JOIN tasks t on report.report_id = t.report_id
WHERE batch_report.batch_report_id = 6;

SELECT * FROM tasks WHERE task_title != 'not specified';
--
-- SELECT * FROM smart_attributes;


