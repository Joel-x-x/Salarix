-- Create schema railway if not exists
CREATE DATABASE IF NOT EXISTS railway;

-- Use schema railway
USE railway;

-- Table users
CREATE TABLE railway.users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL,
    role ENUM('ADMINISTRADOR', 'SUPERADMINISTRADOR', 'EMPLEADO', 'CONTADOR') NOT NULL,
    identification VARCHAR(20) UNIQUE,
    sex BOOLEAN,
    address VARCHAR(255),
    birthday DATE,
    phone VARCHAR(20),
    codeEmployee VARCHAR(10) UNIQUE,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
); 

-- Table departments
CREATE TABLE railway.departments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Table relation deparmets with users
CREATE TABLE railway.user_departments (
    user_id CHAR(36),
    department_id CHAR(36),
    PRIMARY KEY (user_id, department_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Table position
CREATE TABLE railway.positions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- Table salary plan
CREATE TABLE railway.salary_plans (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    position_id CHAR(36),
    baseSalary DOUBLE NOT NULL,
    description TEXT,
    checkin DATETIME NOT NULL,
    checkout DATETIME,
    user_id CHAR(36),
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table registers
CREATE TABLE railway.registers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    start DATETIME NOT NULL,
    finish DATETIME,
    ordinary_time DOUBLE,
    overtime DOUBLE COMMENT '50% add for hour',
    night_overtime DOUBLE COMMENT '100% add for hour',
    user_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
); 

CREATE TABLE `railway`.`dependents` (
  `id` CHAR(36) NOT NULL DEFAULT (UUID()), 
  `name` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(100) NOT NULL,
  `relation` VARCHAR(45) NOT NULL,
  `disability` TINYINT NOT NULL,
  `birthday` DATE NOT NULL,
  `status` BOOLEAN NOT NULL DEFAULT TRUE,  
  `id_user` CHAR(36) NOT NULL, 
  PRIMARY KEY (`id`),  
  CONSTRAINT `fk_iduser_dependents`
    FOREIGN KEY (`id_user`) 
    REFERENCES `users` (`id`)
    ON DELETE CASCADE 
    ON UPDATE CASCADE  
);




