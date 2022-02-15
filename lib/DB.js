import mysql from 'mysql2/promise';

export class DB {
    constructor() {
        this.connection = null;
    }
    async connect() {
        this.connection = await mysql.createConnection({host:'localhost',user:'root',password:'localPass',database:'employee_db'});
    }
    async getEmployee(id = 0){
        if (!id){
            const sql = `SELECT employee.id AS ID, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.name AS 'Role'
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id ORDER BY employee.id ASC`;
            const [rows, columns] = await this.connection.execute(sql);
            return rows;
        }
        const sql = `SELECT employee.id, employee.first_name, employee.last_name, role_id, manager_id
        FROM employee
        WHERE ? = employee.id`;
        const [rows, columns] = await this.connection.execute(sql, [id]);
        return rows;
    }
    async addEmployee(first, last, role, manager){
        const sql = `INSERT INTO employee
        (first_name, last_name, role_id, manager_id)
        VALUES
        (?,?,?,?)`
        const [rows, columns] = await this.connection.execute(sql, [first, last, role, manager]);
        return rows;
    }
    async updateEmployee(i, f, l, r, m){
        const sql = `UPDATE employee
        SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?
        WHERE id = ?`
        const [rows, columns] = await this.connection.execute(sql, [f, l, r, m, i])
        return rows;
    }
    async deleteEmployee(i){
        const sql = `DELETE FROM employee
        WHERE id = ?`;
        const [rows, columns] = await this.connection.execute(sql, [i]);
        return rows;
    }
    async getDepartment(id = 0){
        if (!id){
            const sql = `SELECT name AS Department FROM department ORDER BY name ASC`
            const [rows, columns] = await this.connection.execute(sql);
            return rows;
        }
        const sql = `SELECT name FROM department
        WHERE id = ?`
        const [rows, columns] = await this.connection.execute(sql, [id]);
        return rows;
    }
    async getAllDepartments(){
        const sql = `SELECT * FROM department`;
        const [rows, columns] = await this.connection.execute(sql);
        return rows;
    }
    async addDepartment(n){
        const sql = `INSERT INTO department
        (name)
        VALUES
        (?)`
        const [rows, columns] = await this.connection.execute(sql, [n]);
        return rows;
    }
    async updateDepartment(i, n){
        const sql = `UPDATE department
        SET name = ?
        WHERE id = ?`
        const [rows, columns] = await this.connection.execute(sql, [n, i])
        return rows;
    }
    async deleteDepartment(i){
        const sql = `DELETE FROM department
        WHERE id = ?`
        const [rows, columns] = await this.connection.execute(sql, [i]);
        return rows;
    }
    async getRole(id = 0){
        if (!id){
            const sql = `SELECT role.name AS Role, role.salary AS Salary, department.name AS Department
            FROM role
            LEFT JOIN department ON role.department_id = department.id`;
            const [rows, columns] = await this.connection.execute(sql);
            return rows;
        }
        const sql = `SELECT * FROM role
        WHERE id = ?`
        const [rows, columns] = await this.connection.execute(sql, [id]);
        return rows;
    }
    async addRole(name, salary, department_id){
        const sql = `INSERT INTO role
        (name, salary, department_id)
        VALUES
        (?,?,?)`
        const [rows, columns] = await this.connection.execute(sql, [name, salary, department_id])
        return rows;
    }
    async updateRole(id, name, salary, department_id){
        const sql = `UPDATE role
        SET name = ?, salary = ?, department_id = ?
        WHERE id = ?`
        const [rows, columns] = await this.connection.execute(sql, [name, salary, department_id, id]);
        return rows;
    }
    async deleteRole(id){
        const sql = `DELETE from role
        WHERE id = ?`
        const [rows, columns] = await this.connection.execute(sql, [id]);
        return rows;
    }
    async getAllRoles(){
        const sql = `SELECT * FROM role`;
        const [rows, columns] = await this.connection.execute(sql);
        return rows;
    }
    async getAllEmployees(){
        const sql = `SELECT * FROM employee`;
        const [rows, columns] = await this.connection.execute(sql);
        return rows;
    }
    async getEmployeeId(){
        const sql = `SELECT id FROM employee
        WHERE employee.first_name = ? AND employee.last_name = ?`
    }
    async getRoleId(name){
        const sql = `SELECT id FROM role
        WHERE role.name = ?`
        const [rows, columns] = await this.connection.execute(sql, [name])
        return rows;
    }
    async getAllManagers(){
        const sql = `SELECT DISTINCT manager_id FROM employee
        WHERE employee.manager_id IS NOT NULL`
        const [rows, columns] = await this.connection.execute(sql)
        return rows;
    }
    async getEmployeeByManager(id){
        const sql = `SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.name AS 'Role' FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        WHERE employee.manager_id = ?`
        const [rows, columns] = await this.connection.execute(sql, [id]);
        return rows;
    }
    async getAllByDepartment(id){
        const sql = `SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.name as 'Role', role.salary AS 'Salary' FROM role
        INNER JOIN employee ON role.id = employee.role_id
        WHERE role.department_id = ?`
        const [rows, columns] = await this.connection.execute(sql, [id]);
        return rows;
    }
    async getAllById(arr){     
        let sql = `SELECT  * FROM employee
        WHERE id = ?`;
        for(let i = 1; i < arr.length; i++){
            sql = sql.concat(" OR id = ", arr[i].manager_id)
        };
        const [rows, columns] = await this.connection.execute(sql, [arr[0].manager_id]);
        return rows;
    }
    async getRolesByDept(id){
        const sql = `SELECT id FROM role
        WHERE department_id = ?`
        const [rows, columns] = await this.connection.execute(sql, [id]);
        return rows;
    }
    async getEmployeesByRoles(arr){
        let sql = `SELECT first_name AS 'First Name', last_name AS 'Last Name', role.name AS 'Role' FROM employee
        LEFT JOIN role ON role.id = role_id
        WHERE role_id = ?`;
        for(let i=1;i<arr.length;i++){
            sql = sql.concat(" OR role_id = ", arr[i].id)
        }
        const [rows, columns] = await this.connection.execute(sql, [arr[0].id]);
        return rows;
    }
    async initSchema(){
        const dept = `CREATE TABLE IF NOT EXISTS department (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(30) NOT NULL
        )
        `
        const role = `CREATE TABLE IF NOT EXISTS role(
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(30) NOT NULL,
            salary DECIMAL NOT NULL,
            department_id INTEGER,
            CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
        )`
        const employee = `CREATE TABLE IF NOT EXISTS employee (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            first_name VARCHAR(30) NOT NULL,
            last_name VARCHAR(30) NOT NULL,
            role_id INTEGER,
            manager_id INTEGER,
            CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
            CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
        )`

        const seedDept = `INSERT INTO department
        (name)
        VALUES
        ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal')`
        const seedRole = `INSERT INTO role
        (name, salary, department_id)
        VALUES
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 120000, 2),
        ('Account Manager', 160000, 3),
        ('Accountant', 125000, 3),
        ('Legal Team Manager', 250000, 4),
        ('Lawyer', 190000, 4),
        ('Sales Supervisor', 110000, 1)`

        const seedEmployee = `INSERT INTO employee
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
        ('Melvin', 'Sparks', 3, 13)`

        let init = await this.connection.execute(dept);
        init = await this.connection.execute(role);
        init = await this.connection.execute(employee);
        init = await this.connection.execute(seedDept);
        init = await this.connection.execute(seedRole);
        init = await this.connection.execute(seedEmployee);
        return init;
    }
}