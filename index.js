const inquirer = require("inquirer");
const connection = require('./connection');

function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Add department", "Add Role", "Add Employees", "View departments", "View roles", "View employees",
                "Update Employee Roles"],
            name: "choice"
        }
    ]).then(function (answers) {
        if (answers.choice == "Add department") {
            addDepartment();
        }
        if (answers.choice == "Add Role") {
            addRole();
        }
        if (answers.choice == "Add Employees") {
            addEmployee();
        }
        if (answers.choice == "View departments") {
            viewDepartments();
        }
        if (answers.choice == "View roles") {
            viewRoles();
        }
        if (answers.choice == "View employees") {
            viewEmployees();
        }
        if (answers.choice == "Update Employee Roles") {
            updateEmployee();
        }

    });
}
start();

function addDepartment() {
    inquirer.prompt([
        {
            name: "deptName",
            message: "Please enter the department name: "
        }
    ]).then(function (department) {
        connection.query('INSERT INTO department (name) values (?)', [department.deptName], function (err, res) {
            if (err) {
                console.log(err)
            }
            else {
                start();
            }
        });
    }).catch(function (error) {
        console.log(error);
    })
}

function addRole() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) {
            console.log(err);
        }
        else {
            const departments = res.map(function (department) {
                return department.id + '. ' + department.name;
            });

            inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the role's title: ",
                },
                {
                    type: "input",
                    name: 'salary',
                    message: 'Enter the role salary: ',
                },
                {
                    type: 'list',
                    choices: departments,
                    message: "Enter the department name:",
                    name: 'departmentName',
                }
            ]).then(function (answers) {
                var departmentId = answers.departmentName.split('.')[0];

                connection.query('INSERT INTO role (title, salary, department_id) values (?,?,?) ', [answers.title, answers.salary, departmentId], function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        start();
                    }
                })
            }).catch(function (error) {
                console.log(error);
            })
        }
    });
}


function addEmployee() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) {
            console.log(err);
        }
        else {
            const roles = res.map(function (role) {
                return role.id + '. ' + role.title;
            });

            const managerRole = res.find(function (role) {
                if (role.title.toLowerCase().trim() === 'manager') {
                    return true;
                }
                return false;
            });

            connection.query('SELECT * FROM employee WHERE role_id = ' + managerRole.id, function (err, res) {
                if (err) {
                    console.log(err);
                }
                else {
                    const managers = res.map(function (manager) {
                        return manager.id + '. ' + manager.first_name + manager.last_name;
                    }); managers.push("none")
                    inquirer.prompt([
                        {
                            name: "firstName",
                            message: "Please enter the employee's first name: "
                        },
                        {
                            name: "lastName",
                            message: "Please enter the employee's last name: "
                        },
                        {
                            type: 'list',
                            choices: roles,
                            name: "roleName",
                            message: "Please select the role of the employee: "
                        },
                        {
                            type: 'list',
                            choices: managers,
                            name: "managerId",
                            message: "Please select the manager:"
                        }
                    ]).then(function (answers) {
                        var roleId = answers.roleName.split('.')[0];
                        var managerId;
                        if (answers.managerId === 'None') {
                            managerId = null;
                        } else {
                            managerId = answers.roleName.split('.')[0];
                        }

                        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id ) values (?,?,?,?)', [answers.firstName, answers.lastName, roleId, managerId], function (err, res) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                start();
                            }
                        });
                    }).catch(function (error) {

                    });
                }

            });
        }
    });
}

function viewDepartments() {
    connection.query('SELECT * FROM Department', function (err, departments) {
        if (err) {
            console.log(err);
        }
        else {
            for (var i = 0; i < departments.length; i++) {
                console.log(departments[i].name)
            }
            start()
        }
    });
}

function viewRoles() {
    connection.query('SELECT * FROM Role', function (err, roles) {
        if (err) {
            console.log(err);
        }
        else {
            for (var i = 0; i < roles.length; i++) {
                console.log(roles[i].title)
            }
            start()
        }
    });
}

function viewEmployees() {
    connection.query('SELECT * FROM Employee', function (err, employees) {
        if (err) {
            console.log(err);
        }
        else {
            for (var i = 0; i < employees.length; i++) {
                console.log(employees[i].first_name + " " + employees[i].last_name)
            }
            start()
        }
    });
}

function updateEmployee() {
    connection.query('SELECT * FROM Employee', function (err, employees) {
        if (err) throw err;
        else {
            employees = employees.map(employee => {
                return employee.id + '. ' + employee.first_name + ' ' + employee.last_name;
            });
            connection.query('SELECT * FROM Role', function (err, roles) {
                if (err) throw err;
                else {
                    roles = roles.map(role => {
                        return role.id + '. ' + role.title;
                    })
                    inquirer.prompt([
                        {
                            type: 'list',
                            choices: employees,
                            name: 'employee',
                            message: "Select an employee: ",
                        },
                        {
                            message: 'Select a new role: ',
                            choices: roles,
                            type: 'list',
                            name: 'role'
                        }
                    ]).then(function(answers) {
                        const employeeId = answers.employee.split('.')[0];
                        const roleId = answers.role.split('.')[0];

                        // update employee table where id = employeeId set role_id to roleId
                        connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId], (err, result) => {
                            if (err) throw err;
                            else {
                                start()
                            }
                        })
                    })


                }
            })


        }
    })
}