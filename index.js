const connection = require("./database/connection")
require("console.table")
const { prompt } = require("inquirer")

function start() {
    console.log("Welcome to the CMS for the Employee Database!")
    userPrompts();
}

start();

async function userPrompts() {
    const { choice } = await prompt([
      {
        type: "list",
        name: "choice",
        message: "Please choose an action from the list.",
        choices: [
          {
              name: "View Employees",
              value: "VIEW_EMPLOYEES"
          },
          {
            name: "View Departments",
            value: "VIEW_DEPARTMENTS"
          },
          {
            name: "View Roles",
            value: "VIEW_ROLES"
          },
          {
            name: "Add Employee",
            value: "ADD_EMPLOYEE"
          },
          {
            name: "Add Department",
            value: "ADD_DEPARTMENT"
          },
          {
            name: "Add Role",
            value: "ADD_ROLE"
          },
          {
            name: "Update Employee Role",
            value: "UPDATE_EMPLOYEE_ROLE"
          },
          {
            name: "Quit",
            value: "QUIT"
          }
        ]
      }
    ]);

    switch (choice) {
        case "VIEW_EMPLOYEES":
          return viewEmployees();
        case "VIEW_DEPARTMENTS":
          return viewDepartments();
        case "VIEW_ROLES":
          return viewRoles();
        /*case "ADD_EMPLOYEE":
          return addEmployee();
        case "ADD_DEPARTMENT":
          return addDepartment();
        case "ADD_ROLE":
          return addRole();
        case "UPDATE_EMPLOYEE_ROLE":
          return updateEmployeeRole();*/
        default:
          return quit();
    }
}

//VIEW EMPLOYEES FUNCTIONS
function allEmployees() {
    return connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );    
}

async function viewEmployees() {
 
    const employees = await allEmployees();
  
    console.log("\n");
    console.table(employees);
  
    userPrompts();
}

//VIEW ALL DEPARTMENTS FUNCTION
function allDepartments() {
    return connection.query(
      "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id GROUP BY department.id, department.name"
    );
}

async function viewDepartments() {
    const departments = await allDepartments();
  
    console.log("\n");
    console.table(departments);
  
    userPrompts();
  }


//VIEW ALL ROLES FUNCTIONS
function allRoles() {
    return connection.query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }

async function viewRoles() {
    const roles = await allRoles();
  
    console.log("\n");
    console.table(roles);
  
    userPrompts();
  }


/*connection.query("SELECT * FROM department", function (err, result, fields) {
    if (err) throw err;
    console.table(result);
  });*/