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
            this.db.getAllEmployees().then(result => {
                this.employeeArr = result;
            })
            this.db.getAllRoles().then(result => {
                this.rolesArr = result;
            })
            this.menuRoot();
        });
        let employeeArr = []
        let rolesArr = []
    }
    menuRoot(){
        prompt([{
            'type': 'list',
            'name': 'name',
            'message': 'Root Menu',
            'choices': ['Employees', 'Departments', 'Roles', 'Quit']
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
                value: 'NULL'
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
            value: 'NULL'
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
                if (!conf){
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
                'choices': ['View Role', 'Add Role', 'Update Role', 'Delete Role', 'Back']
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
    departmentMenu(){
        this.db.getDepartment().then((result => {
            table(result)
            prompt([{
                'type': 'list',
                'name': 'name',
                'message': 'Department Menu',
                'choices': ['View Department', 'Add Department', 'Update Department', 'Delete Department', 'Back']
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
    menuHandler(name){
        if (name === 'Quit'){
            process.exit();
        }
        else if (name === 'Employees'){
            this.employeeMenu();
        } else if (name === 'Departments'){
            this.departmentMenu();
        } else if (name === 'Roles'){
            this.roleMenu();
        } else if (name === 'Root') {
            this.menuRoot();
        } else if (name === 'Add Employee'){
            this.addEmployee();
        } else if (name === 'Update Employee') {
            this.updateEmployee();
        } else if (name === 'Delete Employee'){
            this.deleteEmployee();
        } else {
            log(name, " menu does not exist.");
            this.menuRoot();
        }
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