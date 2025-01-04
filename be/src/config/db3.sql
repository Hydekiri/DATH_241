-- Bảng `User`
CREATE TABLE IF NOT EXISTS `User` (
    `user_ID` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255),
    `role` ENUM('student', 'spso') NOT NULL,
    `pageBalance` INT DEFAULT 0
);

-- Bảng `FileType`
CREATE TABLE IF NOT EXISTS `FileType` (
    `type` VARCHAR(50) PRIMARY KEY,
    `spso_ID` INT,
    FOREIGN KEY (`spso_ID`) REFERENCES `User`(`user_ID`) ON DELETE SET NULL
);

-- Bảng `AutoPaper`
CREATE TABLE IF NOT EXISTS `AutoPaper` (
    `semester` VARCHAR(50) PRIMARY KEY,
    `number` INT NOT NULL,
    `scheduler` DATETIME,
    `spso_ID` INT,
    FOREIGN KEY (`spso_ID`) REFERENCES `User`(`user_ID`) ON DELETE SET NULL
);

-- -- Bảng `Location`
-- CREATE TABLE IF NOT EXISTS `Location` (
--     `location_ID` INT PRIMARY KEY AUTO_INCREMENT,
--     `campus` VARCHAR(255),
--     `building` VARCHAR(255),
--     `room` VARCHAR(50)
-- );

-- -- Bảng `Printer`
-- CREATE TABLE IF NOT EXISTS `Printer` (
--     `Printer_ID` INT PRIMARY KEY AUTO_INCREMENT,
--     `branchName` VARCHAR(255),
--     `model` VARCHAR(255),
--     `description` TEXT,
--     `status` ENUM('enable', 'disable') DEFAULT 'enable',
--     `loc_ID` INT,
--     FOREIGN KEY (`loc_ID`) REFERENCES `Location`(`location_ID`) ON DELETE SET NULL
-- );

-- Bảng `Location`
CREATE TABLE IF NOT EXISTS `Location` (
    `location_ID` INT PRIMARY KEY AUTO_INCREMENT,
    `building` VARCHAR(255)
);

-- Bảng `Printer`
CREATE TABLE IF NOT EXISTS `Printer` (
    `Printer_ID` INT PRIMARY KEY AUTO_INCREMENT,
    `branchName` VARCHAR(255),
    `model` VARCHAR(255),
    `description` TEXT,
    `status` ENUM('enable', 'disable') DEFAULT 'enable',
    `loc_ID` INT,
    `weight` VARCHAR(255),
    `printer_type` VARCHAR(255),  -- For example: "In laser trắng đen"
    `queue` INT,                  -- Number of jobs in queue
    `prints_in_day` INT,          -- Number of prints in a day
    `pages_printed` INT,          -- Total pages printed
    `printer_size`  VARCHAR(255),
    `color_print` ENUM('yes', 'no'), -- Whether the printer supports color printing
    `paper_size` VARCHAR(255),    -- Supported paper sizes (e.g., "A4, A5, Legal, Letter")
    `resolution` VARCHAR(50),     -- Printer resolution (e.g., "600x600 dpi")
    `ink_type` VARCHAR(255),      -- Ink type (e.g., "Canon XO 652152-X")
    FOREIGN KEY (`loc_ID`) REFERENCES `Location`(`location_ID`) ON DELETE SET NULL
);

-- Bảng `PrintConfiguration`
CREATE TABLE IF NOT EXISTS `PrintConfiguration` (
    `config_ID` INT PRIMARY KEY AUTO_INCREMENT,
    `printStart` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `printEnd` DATETIME,
    `user_ID` INT,
    `printer_ID` INT,
    `numPages` INT DEFAULT 0,
    `numCopies` INT DEFAULT 1,
    `paperSize` VARCHAR(50),
    `printSide` VARCHAR(50),
    `orientation` VARCHAR(50),
    `status` VARCHAR(50) DEFAULT 'unCompleted',
    FOREIGN KEY (`user_ID`) REFERENCES `User`(`user_ID`) ON DELETE SET NULL,
    FOREIGN KEY (`printer_ID`) REFERENCES `Printer`(`Printer_ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng `Document`
CREATE TABLE IF NOT EXISTS `Document` (
    `config_ID` INT,
    `name` VARCHAR(255) NOT NULL,
    `size` INT NOT NULL,
    `lastModifiedDate` DATETIME NOT NULL,
    PRIMARY KEY (`config_ID`, `name`),
    FOREIGN KEY (`config_ID`) REFERENCES `PrintConfiguration`(`config_ID`) ON DELETE CASCADE
);

-- Bảng `Properties`
CREATE TABLE IF NOT EXISTS `Properties` (
    `config_ID` INT PRIMARY KEY,
    `pageSize` ENUM('A4', 'A3') DEFAULT 'A4',
    `noCopy` INT DEFAULT 1,
    `noPage` INT,
    `startPage` INT,
    `endPage` INT,
    `scale` INT DEFAULT 100,
    `isDuplex` ENUM( '1', '2') DEFAULT '1',
    `orientation` ENUM( 'Dọc', 'Ngang') DEFAULT 'Dọc',
    FOREIGN KEY (`config_ID`) REFERENCES `PrintConfiguration`(`config_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng `Orders`
CREATE TABLE IF NOT EXISTS `Orders` (
    `order_ID` INT AUTO_INCREMENT PRIMARY KEY,
    `user_ID` INT,
    `quantityPaper` INT DEFAULT 0,
    `quantityPackage1` INT DEFAULT 0,
    `quantityPackage2` INT DEFAULT 0,
    `quantityPackage3` INT DEFAULT 0,
    `totalCost` DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    `dateOrder` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `datePaid` DATE DEFAULT NULL,
    `status` ENUM('chưa thanh toán', 'đã thanh toán') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'chưa thanh toán',
    FOREIGN KEY (`user_ID`) REFERENCES `User`(`user_ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Bảng `Paper_Package`
CREATE TABLE IF NOT EXISTS `Paper_Package` (
    `pp_ID` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `quantity` INT NOT NULL,
    `price` INT NOT NULL
);

-- Bảng `Order_Package`
CREATE TABLE IF NOT EXISTS `Order_Package` (
    `order_ID` INT NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `price` INT NOT NULL,
    `originalPrice` INT NOT NULL,
    `discount` INT NOT NULL,
    PRIMARY KEY (`order_ID`, `description`),
    FOREIGN KEY (`order_ID`) REFERENCES `Orders`(`order_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng `Notification_Message`
CREATE TABLE IF NOT EXISTS `Notification_Message` (
    `notification_ID` INT PRIMARY KEY AUTO_INCREMENT,
    `createDate` DATETIME DEFAULT CURRENT_TIMESTAMP,    -- Ngày tạo
    `updateDate` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Ngày cập nhật
    `title` VARCHAR(255) NOT NULL, -- Tiêu đề của thông báo
    `content` TEXT NOT NULL        -- Nội dung thông báo
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng `Receiver_Message` (liên kết thông báo với người nhận)
CREATE TABLE IF NOT EXISTS `Receiver_Message` (
    `notification_ID` INT NOT NULL,   -- ID của thông báo
    `user_ID` INT NOT NULL,           -- ID của người nhận
    `status` ENUM('unread', 'read') DEFAULT 'unread',  -- Trạng thái thông báo
    PRIMARY KEY (`notification_ID`, `user_ID`),       -- Khóa chính gồm cả notification_ID và user_ID
    FOREIGN KEY (`notification_ID`) REFERENCES `Notification_Message`(`notification_ID`) ON DELETE CASCADE,  -- Ràng buộc khóa ngoại
    FOREIGN KEY (`user_ID`) REFERENCES `User`(`user_ID`) ON DELETE CASCADE -- Ràng buộc khóa ngoại
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Queue
CREATE TABLE IF NOT EXISTS `Queue` (
    `queue_ID` INT AUTO_INCREMENT PRIMARY KEY, -- ID của hàng đợi
    `printer_ID` INT NOT NULL,
    `userName` VARCHAR(255) NOT NULL,          -- Tên sinh viên
    `document_name` VARCHAR(255) NOT NULL,     -- Tên tài liệu
    `queue_position` INT NOT NULL,             -- Vị trí hàng đợi
    `status` ENUM('0', '1', '-1') DEFAULT '1', -- Trạng thái: '1' chờ, '0' đang in, '-1' lỗi
    `numPages` INT NOT NULL,                   -- Số lượng trang
    `print_start` DATETIME DEFAULT NULL,       -- Thời gian bắt đầu in
    FOREIGN KEY (`userName`) REFERENCES `User`(`name`) ON DELETE CASCADE,
    FOREIGN KEY (`document_name`) REFERENCES `Document`(`name`) ON DELETE CASCADE,
    FOREIGN KEY (`printer_ID`) REFERENCES `Printer`(`Printer_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--Tự động tạo queue sau khi sinh viên đăng kí in

CREATE TRIGGER after_print_config_insert
AFTER INSERT ON `PrintConfiguration`
FOR EACH ROW
BEGIN
    -- Lấy tên sinh viên từ bảng `User`
    DECLARE student_name VARCHAR(255);
    SET student_name = (SELECT `name` FROM `User` WHERE `user_ID` = NEW.user_ID);

    -- Tính toán vị trí hàng đợi
    DECLARE position INT;
    SET position = (SELECT COUNT(*) + 1 FROM `Queue` WHERE `status` IN ('1', '0'));

    -- Nếu đây là bản ghi đầu tiên trong hàng đợi, set trạng thái là "đang in" (status = 0)
    IF position = 1 THEN
        INSERT INTO `Queue` (
            `userName`,
            `printer_ID`, 
            `document_name`, 
            `queue_position`, 
            `status`, 
            `numPages`, 
            `print_start`
        )
        VALUES (
            student_name, -- Tên sinh viên
            NEW.printer_ID,
            (SELECT `name` FROM `Document` WHERE `config_ID` = NEW.config_ID LIMIT 1), -- Tên tài liệu
            position, -- Vị trí hàng đợi
            '0', -- Trạng thái là "đang in"
            NEW.numPages, -- Số lượng trang từ cấu hình in
            NOW() -- Thời gian bắt đầu in
        );
    ELSE
        -- Nếu không phải bản ghi đầu tiên, trạng thái mặc định là "chờ in" (status = 1)
        INSERT INTO `Queue` (
            `userName`, 
            `printer_ID`,
            `document_name`, 
            `queue_position`, 
            `status`, 
            `numPages`
        )
        VALUES (
            student_name, -- Tên sinh viên
            NEW.printer_ID,
            (SELECT `name` FROM `Document` WHERE `config_ID` = NEW.config_ID LIMIT 1), -- Tên tài liệu
            position, -- Vị trí hàng đợi
            '1', -- Trạng thái là "chờ in"
            NEW.numPages -- Số lượng trang từ cấu hình in
        );
    END IF;
END;

---sau khi một tệp in xong
CREATE TRIGGER after_print_complete
AFTER DELETE ON `Queue`
FOR EACH ROW
BEGIN
    -- Giảm vị trí hàng đợi cho các bản ghi còn lại
    UPDATE `Queue`
    SET `queue_position` = `queue_position` - 1
    WHERE `queue_position` > OLD.queue_position;

    -- Chuyển trạng thái từ '1' thành '0' cho hàng đợi tiếp theo
    UPDATE `Queue`
    SET 
        `status` = '0',
        `print_start` = NOW() -- Cập nhật thời gian bắt đầu in
    WHERE `queue_position` = 1 AND `status` = '1';
END;
--giả sử mỗi trang in trong 5s 
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS process_print_queue
ON SCHEDULE EVERY 1 SECOND
DO
BEGIN
    -- 1. Xử lý bản ghi đang in (status = 0)
    DELETE FROM `Queue`
    WHERE 
        `status` = '0' 
        AND TIMESTAMPDIFF(SECOND, `print_start`, NOW()) >= (`numPages` * 5);

    -- 2. Chuyển bản ghi tiếp theo trong hàng đợi thành "đang in"
    UPDATE `Queue`
    SET 
        `status` = '0', 
        `print_start` = NOW()
    WHERE 
        `queue_position` = 1 
        AND `status` = '1';

    -- 3. Giảm vị trí hàng đợi cho các bản ghi còn lại
    UPDATE `Queue`
    SET `queue_position` = `queue_position` - 1
    WHERE `queue_position` > 1;
END;
