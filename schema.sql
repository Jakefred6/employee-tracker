
-- Drop the database if it exists to start fresh
DROP DATABASE IF EXISTS employee_cms;

-- Create a new database
CREATE DATABASE employee_cms;

-- Switch to using the created database
USE employee_cms;


-- Define the 'departments' table
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for the department
  name VARCHAR(30) NOT NULL  -- Name of the department, cannot be null
);


-- Define the 'roles' table
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for the role
  title VARCHAR(30),  -- Title of the role
  salary DECIMAL,  -- Salary for the role
  department_id INT,  -- Foreign key referencing the 'departments' table
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL  -- Set null on delete to handle cascading deletes
);

-- Define the 'employees' table
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for the employee
  first_name VARCHAR(30),  -- First name of the employee
  last_name VARCHAR(30),  -- Last name of the employee
  role_id INT,  -- Foreign key referencing the 'roles' table
  manager_id INT,  -- Foreign key referencing the same 'employees' table for manager relationship
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,  -- Set null on delete to handle cascading deletes
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL  -- Set null on delete to handle cascading deletes
);
