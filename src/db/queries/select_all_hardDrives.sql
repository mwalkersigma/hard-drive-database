SELECT * FROM report
INNER JOIN device ON device.report_id = report.report_id
INNER JOIN erase ON erase.report_id = report.report_id
INNER JOIN errors ON errors.report_id = report.report_id
INNER JOIN kill_disk ON kill_disk.report_id = report.report_id
INNER JOIN results ON results.report_id = report.report_id
--INNER JOIN smart_attributes ON report.report_id = smart_attributes.report_id
--INNER JOIN smart_parameters ON report.report_id = smart_parameters.report_id
INNER JOIN sys_info ON sys_info.report_id = report.report_id