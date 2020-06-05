DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

USE employees;

CREATE TABLE department
(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (30),
    PRIMARY KEY (id)
);

CREATE TABLE role
    (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR (30) NOT NULL,
    salary DECIMAL (10,2), 
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee
    (
    id INT NOT NULL AUTO_INCREMENT, 
    first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
