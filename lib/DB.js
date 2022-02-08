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
}