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
            INNER JOIN role ON employee.role_id = role.id ORDER BY employee.id ASC`;
            const [rows, columns] = await this.connection.execute(sql);
            return rows;
        }
    }
    async addEmployee(first, last, role, manager){
        const sql = `INSERT INTO employee
        (first_name, last_name, role_id, manager_id)
        VALUES
        (?,?,?,?)`
        const [rows, columns] = await this.connection.execute(sql, [first, last, role, manager]);
        return rows;
    }
    async getDepartment(id = 0){
        if (!id){
            const sql = `SELECT name AS Department FROM employee_db.department ORDER BY name ASC`
            const [rows, columns] = await this.connection.execute(sql);
            return rows;
        }
    }
    async getRole(id = 0){
        if (!id){
            const sql = `SELECT role.name AS Role, role.salary AS Salary, department.name AS Department
            FROM role
            INNER JOIN department ON role.id = department.id`;
            const [rows, columns] = await this.connection.execute(sql);
            return rows;
        }
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
}