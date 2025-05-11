
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('Admin', 'Resident', 'Visitor', 'Guard') NOT NULL,
    linked_table ENUM('Residents', 'Admin') NOT NULL,
    linked_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Residents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    flatId VARCHAR(100) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    dues_amount DECIMAL(10, 2),
    dues_type VARCHAR(50),
    wing VARCHAR(10) NOT NULL,
    flat_number VARCHAR(20) NOT NULL,
    role ENUM('Owner', 'Tenant', 'Family Member') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (wing, flat_number),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Guards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100) NOT NULL,
    shift_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(100) NOT NULL,
    visitor_type ENUM('Guest', 'Delivery', 'Service', 'Other') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE VisitorLog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id INT NOT NULL,
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP NULL,
    approved_by INT NOT NULL,
    approver_type ENUM('Admin', 'Resident') NOT NULL,
    status ENUM('Pending', 'Approved', 'Denied', 'CheckedIn', 'CheckedOut') NOT NULL DEFAULT 'Pending',
    flat_id INT NOT NULL,
    purpose VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES Visitors(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (flat_id) REFERENCES Residents(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    posted_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (posted_by) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Notices Table
CREATE TABLE Notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    posted_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (posted_by) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Dues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Paid', 'Pending', 'Overdue', 'Cleared') NOT NULL DEFAULT 'Pending',
    flat_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES Residents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (flat_id) REFERENCES Residents(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Invoice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Paid', 'Pending', 'Overdue') NOT NULL DEFAULT 'Pending',
    flat_id INT NOT NULL,
    description TEXT,
    payment_date DATE NULL,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flat_id) REFERENCES Residents(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Parking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flat_id INT NOT NULL,
    flat_number VARCHAR(20),
    total_vehicles INT NOT NULL DEFAULT 0,
    allocated_parking_slots INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flat_id) REFERENCES Residents(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flat_id INT NOT NULL,
    parking_id INT NOT NULL,
    vehicle_type ENUM('Car', 'Motorcycle', 'Bicycle', 'Other') NOT NULL,
    vehicle_make VARCHAR(50),
    vehicle_model VARCHAR(50),
    license_plate VARCHAR(20) NOT NULL,
    color VARCHAR(30),
    parking_spot_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flat_id) REFERENCES Residents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (parking_id) REFERENCES Parking(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY (license_plate)
);

CREATE TABLE ParkingLog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP NULL,
    recorded_by INT,
    recorder_type ENUM('Admin', 'Guard') NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE Users MODIFY linked_table ENUM('Residents', 'Admin', 'Guards') NOT NULL;
SELECT * FROM Dues WHERE id = 1;
DESCRIBE Residents;
DESCRIBE Users;
SELECT id, wing, flat_number, full_name, role, dues_amount
FROM Residents
ORDER BY wing, flat_number ASC
LIMIT 10 OFFSET 0;
SELECT * FROM Residents;
select * from admin;
select * from users;
DESCRIBE Residents;
ALTER TABLE Notices
ADD COLUMN expiration_date DATETIME DEFAULT NULL;

ALTER TABLE Residents ADD UNIQUE (user_id);
ALTER TABLE Residents
MODIFY user_id INT DEFAULT NULL;

ALTER TABLE Users
ADD COLUMN contact_info VARCHAR(100) AFTER user_type;


ALTER TABLE Residents
ADD COLUMN contact_info VARCHAR(100) AFTER role;

ALTER TABLE Residents
DROP FOREIGN KEY Residents_ibfk_1, -- Drop the existing foreign key
ADD CONSTRAINT Residents_user_id_fk
FOREIGN KEY (user_id) REFERENCES Users(id)
ON DELETE SET NULL
ON UPDATE CASCADE;
DESCRIBE Residents;
DESCRIBE Users;
ALTER TABLE Residents MODIFY COLUMN dues_amount DECIMAL(10,2) DEFAULT NULL;
ALTER TABLE Residents
MODIFY COLUMN dues_amount DECIMAL(10,2) DEFAULT 0.00;
select * from residents;
UPDATE Residents SET dues_amount = 0.00 WHERE dues_amount IS NULL;
select * from dues;
select * from residents;
select * from users;
CREATE TABLE ParkingSpots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spot_number VARCHAR(20) UNIQUE NOT NULL, -- e.g. 'A-12'
    is_assigned BOOLEAN DEFAULT FALSE,
    assigned_vehicle_id INT, -- Vehicles.id
    assigned_flat_id INT,    -- Residents.id
    FOREIGN KEY (assigned_vehicle_id) REFERENCES Vehicles(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_flat_id) REFERENCES Residents(id) ON DELETE SET NULL
);
DROP TABLE IF EXISTS ParkingLog;
DROP TABLE IF EXISTS ParkingSpots;
DROP TABLE IF EXISTS Vehicles;
DROP TABLE IF EXISTS Parking;
CREATE TABLE Vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flat_id INT NOT NULL,
    vehicle_type ENUM('Car', 'Motorcycle', 'Bicycle', 'Other') NOT NULL,
    vehicle_make VARCHAR(50),
    vehicle_model VARCHAR(50),
    license_plate VARCHAR(20) NOT NULL,
    color VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flat_id) REFERENCES Residents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY (license_plate)
);

CREATE TABLE ParkingSpots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spot_number VARCHAR(20) UNIQUE NOT NULL,                 -- e.g. 'A-12'
    spot_type ENUM('regular', 'extra', 'guest') DEFAULT 'regular',
    is_primary BOOLEAN DEFAULT FALSE,                        -- TRUE if default for flat
    is_assigned BOOLEAN DEFAULT FALSE,
    assigned_flat_id INT DEFAULT NULL,                       -- For default allocation
    assigned_vehicle_id INT DEFAULT NULL,                    -- For extra/guest allocation
    FOREIGN KEY (assigned_flat_id) REFERENCES Residents(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (assigned_vehicle_id) REFERENCES Vehicles(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE ParkingLog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP NULL,
    recorded_by INT,
    recorder_type ENUM('Admin', 'Guard') NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO ParkingSpots (
    spot_number,
    spot_type,
    is_primary,
    is_assigned,
    assigned_flat_id
)
SELECT 
    CONCAT(wing, flat_number),  -- e.g. A101
    'regular',
    TRUE,
    FALSE,
    id
FROM Residents
ON DUPLICATE KEY UPDATE assigned_flat_id = VALUES(assigned_flat_id);
select * from residents;
CREATE TABLE Alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('fire', 'security', 'medical') NOT NULL,
    message TEXT,
    unit VARCHAR(20) NOT NULL,
    resident_id INT,
    status ENUM('active', 'resolved') DEFAULT 'active',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_id) REFERENCES Residents(id) ON DELETE SET NULL
);
ALTER TABLE Users
ADD COLUMN notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN dark_mode BOOLEAN DEFAULT FALSE,
ADD COLUMN two_factor BOOLEAN DEFAULT FALSE;
describe admin;
select * from residents;
select * from users;
CREATE TABLE Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    message TEXT,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
CREATE TABLE UserDevices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_token VARCHAR(255) NOT NULL,
    device_type ENUM('web', 'android', 'ios'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
ALTER TABLE Users
ADD COLUMN mfa_secret VARCHAR(255) DEFAULT NULL,
ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE;
