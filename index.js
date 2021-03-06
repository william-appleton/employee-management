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
        case "ADD_EMPLOYEE":
          return addEmployee();
        case "ADD_DEPARTMENT":
          return addDepartment();
        case "ADD_ROLE":
          return addRole();
        case "UPDATE_EMPLOYEE_ROLE":
          return updateEmployeeRole();
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

//ADD EMPLOYEE FUNCTIONS
function addNewEmployee(employee) {
    return connection.query("INSERT INTO employee SET ?", employee);
}

async function addEmployee() {
    const roles = await allRoles();
    const employees = await allEmployees();
  
    const employee = await prompt([
      {
        name: "first_name",
        message: "What is the first name of the new employee?"
      },
      {
        name: "last_name",
        message: "What is their last name?"
      }
    ]);
  
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id
    }));
  
    const { roleId } = await prompt({
      type: "list",
      name: "roleId",
      message: "What is their role?",
      choices: roleChoices
    });
  
    employee.role_id = roleId;
  
    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
    managerChoices.unshift({ name: "None", value: null });
  
    const { managerId } = await prompt({
      type: "list",
      name: "managerId",
      message: "Who is their manager?",
      choices: managerChoices
    });
  
    employee.manager_id = managerId;
  
    await addNewEmployee(employee);
  
    console.log(
      `Added ${employee.first_name} ${employee.last_name} to the database`
    );
  
    userPrompts();
}

//ADD NEW DEPARTMENT FUNCTIONS
function addNewDepartment(department) {
    return connection.query("INSERT INTO department SET ?", department);
}

async function addDepartment() {
    const department = await prompt([
      {
        name: "name",
        message: "What is the name of the new department?"
      }
    ]);
  
    await addNewDepartment(department);
  
    console.log(`Added ${department.name} to the database`);
  
    userPrompts();
}

//ADD ROLE FUNCTIONS
function addNewRole(role) {
    return connection.query("INSERT INTO role SET ?", role);
}

async function addRole() {
    const departments = await allDepartments();
  
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id
    }));
  
    const role = await prompt([
      {
        name: "title",
        message: "What is the name of the new role?"
      },
      {
        name: "salary",
        message: "What is the salary?"
      },
      {
        type: "list",
        name: "department_id",
        message: "Which department does the role belong to?",
        choices: departmentChoices
      }
    ]);
  
    await addNewRole(role);
  
    console.log(`Added ${role.title} to the database`);
  
    userPrompts();
}

//FUNCTIONS TO UPDATE EMPLOYEE ROLE
function newEmployeeRole(employeeId, roleId) {
    return connection.query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );
}

async function updateEmployeeRole() {
    const employees = await allEmployees();
  
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
  
    const { employeeId } = await prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to update the role for?",
        choices: employeeChoices
      }
    ]);
  
    const roles = await allRoles();
  
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id
    }));
  
    const { roleId } = await prompt([
      {
        type: "list",
        name: "roleId",
        message: "What is their new role?",
        choices: roleChoices
      }
    ]);
  
    await newEmployeeRole(employeeId, roleId);
  
    console.log("Role updated in database");
  
    userPrompts();
}

//QUIT
function quit() {
    console.log("Thank you for using the Employee Database CMS!");
    process.exit();
}