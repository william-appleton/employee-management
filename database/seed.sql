use employees;

INSERT INTO department
    (name)
VALUES
    ('Front End Engineer'),
    ('Back End Engineer'),
    ('Management'),
    ('Human Resources'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Junior Front End', 60000, 1),
    ('Senior Front End', 100000, 1),
    ('Junior Back End', 60000, 2),
    ('Senior Back End', 100000, 2),
    ('Manager', 120000, 3),
    ('CEO', 150000, 3),
    ('Associate HR Administrator', 55000, 3),
    ('Senoir HR Administrator', 80000, 3),
    ('Lawyer', 110000, 4),
    ('Legal Consultant', 90000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES

    ('Katie', 'Goode', 1, 2),
    ('Gala', 'Paterno', 2, NULL),
    ('Avery', 'Jackson', 3, 4),
    ('Rachel', 'Bent', 4, NULL),
    ('Nate', 'Lindholm', 5, 6),
    ('Anita', 'McDonald', 6, NULL),
    ('Jessica', 'Heart', 7, 8),
    ('Mark', 'Jessup', 8, NULL),
    ('Emily', 'Austen', 9, NULL),
    ('Jake', 'Abbot', 10, 9;)