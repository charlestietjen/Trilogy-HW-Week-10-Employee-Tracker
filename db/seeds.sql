INSERT INTO department
    (name)
    VALUES
        ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO role
    (name, salary, department_id)
    VALUES
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 120000, 2),
        ('Account Manager', 160000, 3),
        ('Accountant', 125000, 3),
        ('Legal Team Manager', 250000, 4),
        ('Lawyer', 190000, 4),
        ('Sales Supervisor', 110000, 1);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
    VALUES
        ('Sue', 'Vitzer', 8, NULL),
        ('Sal', 'Pursun', 1, 1),
        ('Angie', 'Nier', 2, NULL),
        ('Sophie', 'Weir', 3, 3),
        ('Akon', 'Manjur', 4, NULL),
        ('Anne', 'Count', 5, 5),
        ('Lee', 'Manwell', 6, NULL),
        ('Lloyd', 'Dhurn', 7, 7),
        ('Ashraf', 'Buckner', 8, NULL),
        ('Vincent', 'Mccullogh', 1, 10),
        ('Nazim', 'Mendez', 1, 1),
        ('Zaki', 'Croft', 1, 10),
        ('Mateusz', 'Travis', 2, NULL),
        ('Melvin', 'Sparks', 3, 13);