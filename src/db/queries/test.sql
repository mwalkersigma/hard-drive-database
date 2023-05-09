SELECT report.report_id FROM report
INNER JOIN device on report.report_id = device.report_id
WHERE device.serial_number = '54OS11XHT8MW';


SELECT * FROM erase
WHERE report_id = 478
