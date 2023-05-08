CREATE TABLE device (
                        report_id INT REFERENCES report(report_id),
                        name VARCHAR(20),
                        serial_number VARCHAR(20),
                        platform_name VARCHAR(50),
                        product_name VARCHAR(50),
                        type VARCHAR(20),
                        product_revision VARCHAR(10),
                        size VARCHAR(20),
                        partitioning VARCHAR(50),
                        total_sectors VARCHAR(20),
                        first_sector INT,
                        bytes_per_sector INT
);

-- Sample data for 'device' table
INSERT INTO device (report_id, name, serial_number, platform_name, product_name, type, product_revision, size, partitioning, total_sectors, first_sector, bytes_per_sector)
VALUES (1, 'sda', 'ABC123', 'x86_64', 'System One', 'SSD', '2.0', '500 GB', 'GPT', '976773168', 2048, 512);
