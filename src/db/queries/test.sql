SELECT * FROM report
--INNER JOIN conclusion ON report.report_id = conclusion.report_id
INNER JOIN device on report.report_id = device.report_id
--INNER JOIN erase on report.report_id = erase.report_id
--INNER JOIN errors e on report.report_id = e.report_id
--INNER JOIN kill_disk on report.report_id = kill_disk.report_id
--INNER JOIN results on report.report_id = results.report_id
--INNER JOIN smart_attributes on report.report_id = smart_attributes.report_id
--WHERE device.serial_number ='0016d0210738ecc62b0087142dc0110b';
--INNER JOIN smart_parameters sp on report.report_id = sp.report_id
--INNER JOIN sys_info si on report.report_id = si.report_id
--INNER JOIN tasks t on report.report_id = t.report_id
--INNER JOIN conclusion c on report.report_id = c.report_id
--WHERE report.report_id = 1;





