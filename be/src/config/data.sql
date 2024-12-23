-- Bảng User
INSERT INTO `User` (`email`, `password`, `name`, `role`, `pageBalance`) VALUES
('student1@example.com', 'password123', 'Student One', 'student', 100),
('student2@example.com', 'password456', 'Student Two', 'student', 150),
('spso1@example.com', 'password789', 'SPSO One', 'spso', 0),
('spso2@example.com', 'password321', 'SPSO Two', 'spso', 0),
('student3@example.com', 'password654', 'Student Three', 'student', 200);

-- Bảng FileType
INSERT INTO `FileType` (`type`, `spso_ID`) VALUES
('PDF', 3),
('DOCX', 3),
('TXT', 4),
('JPEG', 4),
('XLSX', 3);

-- Bảng AutoPaper
INSERT INTO `AutoPaper` (`semester`, `number`, `scheduler`, `spso_ID`) VALUES
('Fall 2024', 5000, '2024-12-01 10:00:00', 3),
('Spring 2025', 6000, '2025-01-15 08:00:00', 4),
('Summer 2025', 4500, '2025-05-01 09:00:00', 3),
('Winter 2025', 5500, '2025-09-01 08:30:00', 4),
('Fall 2025', 7000, '2025-11-01 10:30:00', 3);

-- Bảng Location
INSERT INTO `Location` (`campus`, `building`, `room`) VALUES
('Main Campus', 'Building A', 'Room 101'),
('North Campus', 'Building B', 'Room 202'),
('West Campus', 'Building C', 'Room 303'),
('South Campus', 'Building D', 'Room 404'),
('East Campus', 'Building E', 'Room 505');

-- Bảng Printer
INSERT INTO `Printer` (`branchName`, `model`, `description`, `status`, `loc_ID`) VALUES
('Printer A1', 'HP LaserJet', 'High-speed B&W printer', 'enable', 1),
('Printer B2', 'Canon Pixma', 'Color printer with duplex printing', 'enable', 2),
('Printer C3', 'Epson EcoTank', 'Eco-friendly color printer', 'disable', 3),
('Printer D4', 'Brother HL-L2350DW', 'Compact laser printer', 'enable', 4),
('Printer E5', 'Xerox Phaser', 'High-capacity network printer', 'enable', 5);

-- Bảng PrintConfiguration
INSERT INTO `PrintConfiguration` (`printStart`, `printEnd`, `user_ID`, `printer_ID`, `numPages`, `numCopies`, `paperSize`, `printSide`, `orientation`, `status`) VALUES
('2024-12-01 09:00:00', '2024-12-01 09:30:00', 1, 1, 10, 1, 'A4', 'single', 'portrait', 'completed'),
('2024-12-01 10:00:00', '2024-12-01 10:20:00', 2, 2, 20, 2, 'A4', 'duplex', 'landscape', 'completed'),
('2024-12-01 11:00:00', '2024-12-01 11:15:00', 3, 3, 15, 1, 'A3', 'single', 'portrait', 'unCompleted'),
('2024-12-01 12:00:00', '2024-12-01 12:30:00', 4, 4, 30, 3, 'A4', 'duplex', 'portrait', 'completed'),
('2024-12-01 13:00:00', '2024-12-01 13:10:00', 5, 5, 5, 1, 'A4', 'single', 'landscape', 'completed');

-- Bảng Document
INSERT INTO `Document` (`config_ID`, `name`, `size`, `lastModifiedDate`) VALUES
(1, 'Document1.pdf', 1024, '2024-11-30 08:00:00'),
(2, 'Document2.docx', 2048, '2024-11-30 09:00:00'),
(3, 'Document3.xlsx', 3072, '2024-11-30 10:00:00'),
(4, 'Document4.txt', 512, '2024-11-30 11:00:00'),
(5, 'Document5.jpeg', 4096, '2024-11-30 12:00:00');

-- Bảng Properties
INSERT INTO `Properties` (`config_ID`, `pageSize`, `noCopy`, `noPage`, `startPage`, `endPage`, `scale`, `isDuplex`, `orientation`) VALUES
(1, 'A4', 1, 10, 1, 10, 100, '1', 'Dọc'),
(2, 'A4', 2, 20, 1, 20, 100, '2', 'Ngang'),
(3, 'A3', 1, 15, 5, 20, 90, '1', 'Dọc'),
(4, 'A4', 3, 30, 1, 30, 80, '2', 'Dọc'),
(5, 'A4', 1, 5, 1, 5, 100, '1', 'Ngang');

-- Bảng Orders
INSERT INTO `Orders` (`user_ID`, `quantityPaper`, `quantityPackage1`, `quantityPackage2`, `quantityPackage3`, `totalCost`, `dateOrder`, `datePaid`, `status`) VALUES
(1, 500, 1, 2, 0, 50.00, '2024-12-01', NULL, 'chưa thanh toán'),
(2, 1000, 0, 1, 1, 100.00, '2024-12-01', '2024-12-02', 'đã thanh toán'),
(3, 750, 3, 0, 1, 75.00, '2024-12-01', NULL, 'chưa thanh toán'),
(4, 250, 0, 0, 2, 25.00, '2024-12-01', NULL, 'chưa thanh toán'),
(5, 300, 1, 1, 1, 30.00, '2024-12-01', '2024-12-02', 'đã thanh toán');

-- Bảng Paper_Package
INSERT INTO `Paper_Package` (`name`, `quantity`, `price`) VALUES
('Basic Package', 500, 10),
('Standard Package', 1000, 18),
('Premium Package', 1500, 25),
('Eco-Friendly Package', 750, 15),
('Custom Package', 250, 8);

-- Bảng Order_Package
INSERT INTO `Order_Package` (`order_ID`, `description`, `price`, `originalPrice`, `discount`) VALUES
(1, 'Basic Package', 10, 12, 2),
(2, 'Standard Package', 18, 20, 2),
(3, 'Premium Package', 25, 30, 5),
(4, 'Eco-Friendly Package', 15, 18, 3),
(5, 'Custom Package', 8, 10, 2);

-- Bảng Notification_Message
INSERT INTO `Notification_Message` (`title`, `content`) VALUES
('Welcome Message', 'Welcome to our printing service!'),
('System Maintenance', 'Scheduled maintenance will occur on 2024-12-05 from 00:00 to 04:00.'),
('New Printer Available', 'A new high-speed printer has been added to the South Campus.'),
('Payment Reminder', 'Your pending orders need to be paid by 2024-12-10.'),
('Holiday Announcement', 'Our office will be closed on 2024-12-25 for the holidays.');

-- Bảng Receiver_Message
INSERT INTO `Receiver_Message` (`notification_ID`, `user_ID`, `status`) VALUES
(1, 1, 'read'),
(2, 2, 'unread'),
(3, 3, 'read'),
(4, 4, 'unread'),
(5, 5, 'read');
