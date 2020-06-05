const inquirer = require("inquirer");
const conTable = require("console.table");
const connection = require("./connection.js");

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as ID: ${connection.threadId}`);
    startMenu()
})

const startMenu = () => {
    inquirer.prompt(
        {
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["Add a Department", "Add a Role", "Add an Employee", "View Department List", "View Role List", "View Employee List", "Update an Employee Role", "EXIT"]
        }
    ).then(({ action }) => {
        switch (action) {
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add a Employee":
                addEmployee();
                break;
            case "View Department List":
                viewDepartment();
                break;
            case "View Role List":
                viewRole();
                break;
            case "View Employee List":
                viewEmployee();
                break;
            case "Update an Employee Role":
                updateEmployee();
                break;
            default:
                connection.end();

        }

    })

}

const addDepartment = () => {
    inquirer.prompt(
        {
            name: "name",
            message: "What department would you like to add?"
        }
    ).then(({ name }) => {

        connection.query("INSERT INTO department SET ?", { name: name }, (err, res) => {
            if (err) throw err;
            console.log(`Added ${res.affectedRows} successfully!`)
            startMenu();
        })

    })

}

const addRole = () => {

    connection.query("SELECT name FROM department", (err, res) => {
        if (err) throw err;
        //?? can I display the department list first and THEN prompt?
        inquirer.prompt([
            {
                name: "title",
                message: "What role would you like to add?",
            },
            {
                name: "salary",
                message: "What is the salary for this role?",
            },
            {
                // ? How can I turn the department to match a number inside of my id? would I have to do a join?
                type: "rawlist",
                name: "department_id",
                message: "What department does this role belong to?",
                choices: res
            }

        ]).then(({ title, salary, department_id }) => {
            connection.query("INSERT INTO role SET ?",
                {
                    title,
                    salary,
                    department_id

                }, (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${res} to Role List`)

                    // for (i = 0; i < res.length; i++) {

                    //     conTable(title, salary, department_id)
                    // }
                    startMenu();
                })
        })

    })
}

const addEmployee = () => {
    connection.query("", (err, data) => {
        if (err) throw err;
        inquirer.prompt([
            {

            }
        ]).then(({ }) => {

        })
    })
}

const viewDepartment = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;

        console.table(res);
        startMenu();
    })

}

const viewRole = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;

        console.table(res);
        startMenu();
    })

}

const viewEmployee = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;

        console.table(res);
        startMenu();
    })

}

const updateEmployee = () => {
    inquirer.prompt([
        {

        }
    ]).then(({ }) => {

    })
}