CREATE TABLE device
(
    name             varchar(20) NOT NULL,
    serial_number    varchar(20) NOT NULL,
    platform_name    varchar(50) NOT NULL,
    product_name     varchar(50) NOT NULL,
    type             varchar(20) NOT NULL,
    product_revision varchar(10) NOT NULL,
    partitioning     varchar(50) NOT NULL,
    total_sectors    varchar(20) NOT NULL,
    first_sector     int NOT NULL,
    bytes_per_sector int NOT NULL,
    report_id        bigint NOT NULL,
    CONSTRAINT FK_3 FOREIGN KEY ( report_id ) REFERENCES report ( report_id )
);

CREATE INDEX FK_1 ON device
    (report_id);



-- Sample data for 'device' table
INSERT INTO device (report_id, name, serial_number, platform_name, product_name, type, product_revision, size, partitioning, total_sectors, first_sector, bytes_per_sector)
VALUES (1, 'sda', 'ABC123', 'x86_64', 'System One', 'SSD', '2.0', '500 GB', 'GPT', '976773168', 2048, 512);



