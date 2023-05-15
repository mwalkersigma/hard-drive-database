INSERT INTO batch_report ( created, provider, version, kernel_version, started, elapsed, result)
VALUES ('2017-03-01', 'test', '1.0', '1.0', '2017-03-01', '2017-03-01', '2017-03-01')
RETURNING batch_report_id;


-- delete the above row
--DELETE FROM batch_report WHERE provider = 'test';

--SELECT * FROM batch_report;
