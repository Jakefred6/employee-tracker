-- Seed for department table
INSERT INTO department (name) VALUES
  ('Sales'),
  ('Finance'),
  ('HR'),
  ('Marketing'),
  ('IT'),
  ('Operations'),
  ('Customer Service'),
  ('R&D'),
  ('Legal'),
  ('Administration');

-- Seed for roles table
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Representative', 50000.00, 1),
  ('Financial Analyst', 60000.00, 2),
  ('HR Specialist', 55000.00, 3),
  ('Marketing Coordinator', 48000.00, 4),
  ('IT Specialist', 65000.00, 5),
  ('Operations Manager', 70000.00, 6),
  ('Customer Representative', 48000.00, 7),
  ('R&D Scientist', 75000.00, 8),
  ('Legal Counsel', 80000.00, 9),
  ('Administrator', 55000.00, 10);

-- Seed for employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, 1),
  ('Jane', 'Smith', 1, 1),
  ('Mike', 'Johnson', 2, 1),
  ('Emily', 'Brown', 2, 3),
  ('Alex', 'Jones', 3, 1),
  ('Sarah', 'Davis', 4, 2),
  ('Robert', 'Clark', 5, 1),
  ('Megan', 'Taylor', 5, 6),
  ('David', 'Miller', 6, 1),
  ('Olivia', 'Wilson', 6, 7);

