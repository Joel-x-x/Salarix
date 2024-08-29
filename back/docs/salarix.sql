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
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Table salary plan
CREATE TABLE railway.salary_plans (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    position_id CHAR(36),
    baseSalary DOUBLE NOT NULL,
    description TEXT,
    checkin TIME,
    checkout TIME,
    esc DOUBLE, -- Egresos: Extensión de salud por Cónyuge (Valor mensual determinado por la ley o póliza)
    cp DOUBLE, -- Ingresos: Comisión %
    esc_included BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si el plan incluye extensión de salud por cónyuge
    cp_included BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si el plan incluye Comisión %
    app_included BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si el plan incluye Aporte Patronal %
    dts_included BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si el plan incluye Décimo tercer sueldo
    dcs_included BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si el plan incluye Décimo cuarto sueldo
    frp_included BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si el plan incluye Fondo de reserva %
    apep_included BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si el plan incluye Aporte personal %
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

-- Table dependents
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

-- Table nomina
CREATE TABLE railway.nomina (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    periodName VARCHAR(100) NOT NULL,
    start DATE NOT NULL,
    finish DATE NOT NULL,
    detail TEXT,
    totalGross DOUBLE,
    totalIncome DOUBLE,
    totalEgress DOUBLE,
    totalLiquid DOUBLE,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table detail nomina
CREATE TABLE railway.detail_nomina (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    detail TEXT,
    type BOOLEAN NOT NULL COMMENT '0 = Egreso, 1 = Ingreso',
    monto DOUBLE NOT NULL,
    isBonus BOOLEAN DEFAULT FALSE,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    nomina_id CHAR(36),
    FOREIGN KEY (nomina_id) REFERENCES nomina(id) ON DELETE CASCADE
);

-- Table formula
CREATE TABLE railway.formula (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- Identificador único para cada registro
    app DOUBLE, -- Ingresos: Aporte Patronal %
    dts DOUBLE, -- Ingresos: Décimo tercer sueldo (meses para los que se divide)
    frp DOUBLE, -- Ingresos: Fondo de reserva %
    apep DOUBLE, -- Egresos: Aporte personal %
    date DATETIME DEFAULT CURRENT_TIMESTAMP -- Fecha y hora del registro
);

-- Table vacations
CREATE TABLE railway.vacations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    totalDays INT NOT NULL,
    periodo VARCHAR(255) NOT NULL,
    daysTaken INT NOT NULL,
    start DATE NOT NULL,
    finish DATE NOT NULL,
    detail TEXT,
    user_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id)
);









