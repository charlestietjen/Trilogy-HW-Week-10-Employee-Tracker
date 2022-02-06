## DB Structure

### Schema

#### tables

department  role    employee

#### department

id INT PRIMARY KEY AUTO INCREMENT

name VARCHAR(30) NOT NULL


#### role

id INT PRIMARY KEY AUTO INCREMENT

title VARCHAR(30) NOT NULL

salary DECIMAL NOT NULL

department_id INT FOREIGN KEY (from department.id)

#### employee

id INT PRIMARY KEY AUTO INCREMENT

first_name VARCHAR(30) NOT NULL

last_name VARCHAR(30) NOT NULL

role_id INT FOREIGN KEY (from role.id)

manager_id INT FOREIGN KEY (from employee.id)


## App Structure

### DB Methods

Use a constructor class DB to hold all database related methods in their own module

## Required methods

- getDepartment(name = *) default get all, pass a parameter to get a specific department
- getRole(name = *) default get all, pass a parameter to get a specific role
- getEmployee(name = *) default get all, pass a parameter to get a specific employee
- addDepartment(name) insert a department into the table of the given name
- addRole(title, salary, department_id) insert a role into the roles table of the given title, salary and department_id
- addEmployee(first_name, last_name, role_id, manager_id) insert an employee into the employee table
- updateEmployee(first_name, last_name, role_id, manager_id) can make parameters optional but it'll be a pita

## Menu structure

### root

- Employees
- Departments
- Roles
- Quit

### employees

- Renders all employees in a table
- Add Employee
- Update Employee
- Delete Employee
- Back

### departments

- Renders all departments in table
- View Department
- Add Department
- Update Department
- Delete Department
- Back

### roles

- Renders all roles in a table
- Add Role
- Update Role
- Delete Role
- Back

### Add

- Prompts for each prerequisite field
- Passes fields as parameters to appropriate add function to our DB instance
- Invokes it's parent menu to render an updated table and present the menu options again

### Update

- Get all from relevant table
- Choice prompt using the resulting arrays name propeties
- For department just ask for a new name since it's only one field
- For other tables show list prompt for individual fields and a finish
    - Eg. Employee
            - First Name
            - Last Name
            - Title
            - Manager
            - Finish
    Set values to their current when first selecting the employee then change vars to entered values, send info to DB on finish

### Delete

- Get all from relevant table
- Choice prompt using resulting arrays name properties
    - Are you sure list menu
        - No (default)
        - Yes - Update DB
    - Push back to parent menu

## Acceptance Criteria

- GIVEN a command-line application that accepts user input
- WHEN I start the application
- THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
- WHEN I choose to view all departments
- THEN I am presented with a formatted table showing department names and department ids
- WHEN I choose to view all roles
- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
- WHEN I choose to view all employees
- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
- WHEN I choose to add a department
- THEN I am prompted to enter the name of the department and that department is added to the database
- WHEN I choose to add a role
- THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
- WHEN I choose to add an employee
- THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
- WHEN I choose to update an employee role
- THEN I am prompted to select an employee to update and their new role and this information is updated in the database

## Optional Marks

- Update employee managers.
- View employees by manager.
- View employees by department.
- Delete departments, roles, and employees.
- View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.