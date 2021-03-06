import inquirer from 'inquirer';
import { DB } from './DB.js';
import figlet from 'figlet';

const log = console.log;
const table = console.table;
const prompt = inquirer.prompt;
const reqField = 'This is a required field.';

export class Menu{
    constructor(){
        this.db = new DB();
        titleArt();
        this.db.connect(err => {
            if (err) throw err;
        })
        .then(log => {
            // fill global arrays
            this.db.initSchema(err =>{
                if (err) throw err;
            })
            .then(res => {
            this.updateArrays();
            this.menuRoot();
            })
        });
        let employeeArr = []
        let rolesArr = []
        let departmentArr = []
    }
    menuRoot(){
        prompt([{
            'type': 'list',
            'name': 'name',
            'message': 'Root Menu',
            'choices': ['Employees', 'Departments', 'Roles', 'Reports', 'Quit']
        }])
        .then((choice) => {
            this.menuHandler(choice.name);
        })
    }
    employeeMenu(){
        this.db.getEmployee().then((result => {
            table(result)
            prompt([{
                'type': 'list',
                'name': 'name',
                'message': 'Employee Menu',
                'choices': ['Add Employee', 'Update Employee', 'Delete Employee', 'Back']
            }])
            .then((choice) => {
                if (choice.name === 'Back'){
                    this.menuHandler('Root');
                } else {
                    this.menuHandler(choice.name);
                }
            })
        }));
    }
    addEmployee(){
            let rolesArr = []
            rolesArr = this.rolesArr.map(a => {
                return {
                    name: a.name,
                    value: a.id
                }
            })
            let managerArr = [{
                name: "None",
                value: null
            }];
            managerArr = managerArr.concat(this.employeeArr.map(emp => {
                return {
                    name: emp.first_name.concat(" ", emp.last_name),
                    value: emp.id
                }
            }))
            prompt([{
                'type': 'input',
                'name': 'firstName',
                'message': 'Enter first name: ',
                'validate': input => {
                    if (!input){
                        log(reqField);
                        return false;
                    }
                    return true;
                }
            },
            {
                'type': 'input',
                'name': 'lastName',
                'message': 'Enter last name: ',
                'validate': input => {
                    if (!input){
                        log(reqField);
                        return false;
                    }
                    return true;
                }
            },
            {
                'type': 'list',
                'name': 'roleId',
                'message': 'Select employee role: ',
                'choices': rolesArr
            },
            {
                'type': 'list',
                'name': 'managerId',
                'message': "(Optional)Select this employee's Manager",
                'choices': managerArr
            }
        ])
        .then((answer) => {
            this.db.addEmployee(answer.firstName, answer.lastName, answer.roleId, answer.managerId)
            .then(this.menuHandler('Employees'))
        })
    }
    updateEmployee(){
        let employeeArr = this.employeeArr.map(emp => {
            return {
                name: emp.first_name.concat(" ", emp.last_name),
                value: emp.id
            }
        })
        let rolesArr = []
        rolesArr = this.rolesArr.map(a => {
            return {
                name: a.name,
                value: a.id
            }
        })
        let managerArr = [{
            name: "None",
            value: null
        }];
        managerArr = managerArr.concat(this.employeeArr.map(emp => {
            return {
                name: emp.first_name.concat(" ", emp.last_name),
                value: emp.id
            }
        }))
        let employee;
        prompt([
            {
                'type': 'list',
                'name': 'id',
                'message': "Select the employee you'd like to edit.",
                'choices': employeeArr
            }
        ])
        .then((answer) => {
            this.db.getEmployee(answer.id).then(res => {
                res = res[0];
                employee = res;
                prompt([
                    {
                        'type': 'input',
                        'name': 'firstName',
                        'message': 'Edit first name: ',
                        'default': employee.first_name,
                        'validate': input => {
                            if (!input){
                                log(reqField);
                                return false;
                            }
                            return true;
                    }
                    },
                    {
                        'type': 'input',
                        'name': 'lastName',
                        'message': 'Edit last name: ',
                        'default': employee.last_name,
                        'validate': input => {
                            if (!input){
                                log(reqField)
                                return false;
                            }
                                return true;
                        }
                    },
                    {
                        'type': 'list',
                        'name': 'roleId',
                        'message': "Select employee's role: ",
                        'choices': rolesArr
                    },
                    {
                        'type': 'list',
                        'name': 'managerId',
                        'message': "Select employee's manager: ",
                        'choices': managerArr
                    }
                ])
                .then((answer) => {
                    this.db.updateEmployee(employee.id, answer.firstName, answer.lastName, answer.roleId, answer.managerId)
                    .then(this.menuHandler('Employees'));
                })
            })
        })
    }
    deleteEmployee(){
        let employeeArr = [{
            name: 'Cancel',
            value: false
        }];
        employeeArr = employeeArr.concat(this.employeeArr.map(emp => {
            return {
                name: emp.first_name.concat(" ", emp.last_name),
                value: emp.id
            }
        }))
        prompt([
            {
                'type': 'list',
                'name': 'name',
                'message': 'Select the employee you wish to delete: ',
                'choices': employeeArr
            }
        ])
        .then((answer) => {
            if (!answer.name){
                this.menuHandler('Employees');
                return;
            }
            prompt([
                {
                    'type': 'confirm',
                    'name': 'deleteConf',
                    'message': 'Are you sure? ',
                    'default': false
                }
            ]).then((conf) => {
                if (!conf.deleteConf){
                    this.menuHandler('Employees');
                    return;
                }
                this.db.deleteEmployee(answer.name)
                .then(this.menuHandler('Employees'));
            })
        })
    }
    roleMenu(){
        this.db.getRole().then((result => {
            table(result)
            prompt([{
                'type': 'list',
                'name': 'name',
                'message': 'Role Menu',
                'choices': ['Add Role', 'Update Role', 'Delete Role', 'Back']
            }])
            .then((choice) => {
                if (choice.name === 'Back'){
                    this.menuHandler('Root');
                } else {
                    this.menuHandler(choice.name);
                }
            })
        }))
    }
    addRole(){
        let deptArr = this.departmentArr.map(a => {
            return {
                name: a.name,
                value: a.id
            }
        })
        prompt([{
            'type': 'input',
            'name': 'name',
            'message': 'Enter a name for the new role: ',
            'validate': input => {
                if (!input){
                    log(reqField);
                    return false;
                }
            return true;
            }
        },
        {
            'type': 'number',
            'name': 'salary',
            'message': "Enter this role's salary: ",
            'validate': input => {
                if (!input) {
                    log(reqField);
                    return false;
                }
            return true;
            }
        },
        {
            'type': 'list',
            'name': 'dept',
            'message': 'Choose a department for this role: ',
            'choices': deptArr
        }])
        .then((answer) => {
            this.db.addRole(answer.name, answer.salary, answer.dept)
            .then(this.menuHandler('Roles'));
        })
    }
    updateRole(){
        let rolesArr = [{
            name: 'Cancel',
            value: false
        }];
        rolesArr = rolesArr.concat(this.rolesArr.map(arr => {
            return {
                name: arr.name,
                value: arr.id
            }
        }))
        let deptArr = this.departmentArr.map(arr => {
            return {
                name: arr.name,
                value: arr.id
            }
        })
        prompt([
            {
                'type': 'list',
                'name': 'choice',
                'message': 'Choose a role to update: ',
                'choices': rolesArr
            }
        ])
        .then((a) => {
            if (!a){
                this.menuHandler('Roles');
                return;
            }
            this.db.getRole(a.choice)
            .then(res => {
                res = res[0]
                prompt([
                    {
                        'type': 'input',
                        'name': 'name',
                        'default': res.name,
                        'validate': input => {
                            if (!input){
                                log(reqField);
                                return false;
                            }
                        return true;
                        }
                    },
                    {
                        'type': 'number',
                        'name': 'salary',
                        'default': res.salary,
                        'validate': input => {
                            if (!input){
                                log(reqField);
                                return false;
                            }
                        return true;
                        }
                    },
                    {
                        'type': 'list',
                        'name': 'deptId',
                        'choices': deptArr
                    }
                ])
                .then((a) => {
                    this.db.updateRole(res.id, a.name, a.salary, a.deptId)
                    .then(this.menuHandler('Roles'));
                })
            })
        })
    }
    deleteRole(){
        let rolesArr = [{name:'Cancel',value:false}];
        rolesArr = rolesArr.concat(this.rolesArr.map(arr => {
            return {name:arr.name,value:arr.id};
        }));
        prompt([
            {
                'type':'list',
                'name':'choice',
                'message':'Which role would you like to delete?',
                'choices':rolesArr,
                'default':0
            }
    ])
    .then((answer) => {
        if (!answer.choice){
            this.menuHandler('Roles');
            return;
        }
        prompt([
            {
               'type': 'confirm',
               'name': 'conf',
               'default':false,
               'message':'Are you sure?'
            }
    ])
    .then((a) => {
        if (!a.conf){
            this.menuHandler('Roles');
            return;
        }
        this.db.deleteRole(answer.choice)
        .then(this.menuHandler('Roles'));
    })
    })
    }
    departmentMenu(){
        this.db.getDepartment().then((result => {
            table(result)
            prompt([{
                'type': 'list',
                'name': 'name',
                'message': 'Department Menu',
                'choices': ['Add Department', 'Update Department', 'Delete Department', 'Back']
            }])
            .then((choice) => {
                if (choice.name === 'Back'){
                    this.menuHandler('Root');
                } else {
                    this.menuHandler(choice.name);
                }
            })
        }))
    }
    addDepartment(){
        prompt([{
            'type': 'input',
            'name': 'name',
            'message': 'Enter the name of the new deparment: ',
            'validate': input => {
                if (!input){
                    log(reqField);
                    return false;
                }
                return true;
            }
        }])
        .then((answer) => {
            this.db.addDepartment(answer.name)
            .then(this.menuHandler('Departments'));
        })
    }
    updateDepartment(){
        let deptArr = [{
            name: 'Cancel',
            value: false
        }]
        deptArr = deptArr.concat(this.departmentArr.map(arr => {
            return {
                name: arr.name,
                value: arr.id
            }
        }))
        prompt([{
            'type': 'list',
            'name': 'choice',
            'message': 'Which department are you editing? ',
            'choices': deptArr
        }])
        .then((answer) => {
            if (!answer){
                this.menuHandler('Departments');
                return;
            }
            this.db.getDepartment(answer.choice)
            .then(res => {
                prompt([{
                    'type': 'input',
                    'name': 'name',
                    'default': res.name,
                    'message': "Enter department's new name: ",
                    'validate': input => {
                        if (!input){
                            log(reqField);
                            return;
                        }
                        return true;
                    }
                }])
                .then((a) => {
                    this.db.updateDepartment(answer.choice, a.name)
                    .then(this.menuHandler('Departments'));
                })
            })
        })
    }
    deleteDepartment(){
        let deptArr = [{
            name: 'Cancel',
            value: false
        }]
        deptArr = deptArr.concat(this.departmentArr.map(arr => {
            return {
                name: arr.name,
                value: arr.id
            }
        }))
        prompt([{
            'type': 'list',
            'name': 'choice',
            'message': 'Which department would you like to delete? ',
            'choices': deptArr
        }])
        .then((answer) => {
            if (!answer.choice){
                this.menuHandler('Departments');
                return;
            }
            prompt([
                {
                    'type': 'confirm',
                    'name': 'deleteConf',
                    'message': 'Are you sure? ',
                    'default': false
                }
            ]).then((conf) => {
                if (!conf.deleteConf){
                    this.menuHandler('Departments');
                    return;
                }
                this.db.deleteDepartment(answer.choice)
                .then(this.menuHandler('Departments'));
            })})
    }
    reportsMenu(){
        prompt([
            {
                'type': 'list',
                'name': 'c',
                'choices': ['Employees by Manager', 'Employees by Department', 'Department Budget', 'Back'],
                'message': 'Select a report type: '
            }
        ]).then((a) =>{
            if (a === 'Back'){
                this.menuHandler('Reports');
                return;
            }
            this.menuHandler(a.c);
        })
    }
    employeeByManager(){
        this.db.getAllManagers().then(res =>{this.db.getAllById(res).then(res=>{
            let manArr = res.map(arr => {return {name:arr.first_name.concat(" ", arr.last_name),value:arr.id}})
            prompt([
                {
                    'type':'list',
                    'name':'m',
                    'message':'Select a manager: ',
                    'choices': manArr
                }
            ])
            .then((a) => {
                this.db.getEmployeeByManager(a.m)
                .then(res => {
                    table(res)
                    this.menuHandler('Reports');
                })

            })
        })})
    }
    employeeByDepartment(){
        const deptArr = this.departmentArr.map(arr => {
            return {name: arr.name, value:arr.id};
        });
        prompt([
            {
                'type':'list',
                'name':'dept',
                'choices': deptArr,
                'message': 'Select a department: '
            }
        ]).then((a) => {
            this.db.getRolesByDept(a.dept)
            .then(res => {
                this.db.getEmployeesByRoles(res)
                .then(res => {
                    table(res);
                    this.menuHandler('Reports');
                })
            })
        })
    }
    departmentBudget(){
        const deptArr = this.departmentArr.map(arr =>{
            return {name: arr.name, value:arr.id}
        });
        prompt([
            {
                'type':'list',
                'name':'dept',
                'choices':deptArr,
                'message':'Select a department: '
            }
        ]).then((a) => {
            this.db.getAllByDepartment(a.dept)
            .then(res => {
                let totalSal = 0;
                res.forEach(arr => {
                    totalSal += Number(arr.Salary);
                })
                const totalTable = {
                    'Department Total':totalSal
                }
                table(res);
                table(totalTable)
                this.menuHandler('Reports'
                )
            })
        })
    }
    menuHandler(name){
        this.updateArrays();
        if (name === 'Quit'){
            process.exit();
        }
        else if (name === 'Employees'){
            this.employeeMenu();
        } else if (name === 'Departments'){
            this.departmentMenu();
        } else if (name === 'Roles'){
            this.roleMenu();
        } else if (name === 'Reports'){
            this.reportsMenu();
        } else if (name === 'Root') {
            this.menuRoot();
        } else if (name === 'Add Employee'){
            this.addEmployee();
        } else if (name === 'Update Employee') {
            this.updateEmployee();
        } else if (name === 'Delete Employee'){
            this.deleteEmployee();
        } else if (name === 'Add Role'){
            this.addRole();
        } else if (name === 'Update Role'){
            this.updateRole();
        } else if (name === 'Delete Role'){
            this.deleteRole();
        } else if (name === 'Add Department'){
            this.addDepartment();
        } else if (name === 'Update Department'){
            this.updateDepartment();
        } else if (name === 'Delete Department'){
            this.deleteDepartment();
        } else if(name === 'Employees by Manager'){
            this.employeeByManager();
        } else if(name === 'Employees by Department'){
            this.employeeByDepartment();
        } else if (name === 'Department Budget'){
            this.departmentBudget();
        } else {
            log(name + " menu does not exist.");
            this.menuRoot();
        }
    }
    updateArrays(){
        this.db.getAllEmployees().then(result => {
            this.employeeArr = result;
        })
        this.db.getAllRoles().then(result => {
            this.rolesArr = result;
        })
        this.db.getAllDepartments().then(result => {
            this.departmentArr = result;
        });
    }
}

const titleArt = function() {
        figlet.text('Employee Tracker 3000',{
            font: 'Doom',
            horizontalLayout: 'default',
            verticalLayout: 'fitted',
            width: 80,
            whitespaceBreak: true
        }, function(err, data){
            if (err) throw err;
            log(data);
        });
};