const mysql = require("mysql2");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Admin@123",
  database: "employee_cms",
});

connection.connect(function (err) {
  if (err) throw err;
  intro();
  start_app();
});

function start_app() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "+ Add department",
        "+ Add role",
        "+ Add employee",
        "> View departments",
        "> View roles",
        "> View employees",
        "* Update employee role",
        "- Delete employee",
        "x End application",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "+ Add department":
          addDepartment();
          break;

        case "+ Add role":
          addRole();
          break;

        case "+ Add employee":
          addEmployee();
          break;

        case "> View departments":
          viewDepartment();
          break;

        case "> View roles":
          viewRole();
          break;

        case "> View employees":
          viewEmployee();
          break;

        case "* Update employee role":
          updateEmployeeRole();
          break;

        case "- Delete employee":
          deleteEmployee();
          break;

        case "x End application":
          console.log("Ending application.");
          exit();
          connection.end();
          break;
      }
    })
    .catch((err) => console.error(err));
}

function addDepartment() {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      message: "Department name:",
    })
    .then(function (answer) {
      const query = "INSERT INTO department SET ?";
      connection.query(
        query,
        {
          name: answer.newDepartment,
        },
        function (err, data) {
          if (err) throw err;
          console.log("Department added.");
          viewDepartment();
        }
      );
    })
    .catch((err) => console.error(err));
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Title of Role: ",
      },
      {
        name: "salary",
        type: "input",
        message: "Salary:",
      },
      {
        name: "departmentId",
        type: "list",
        message: "Department ID:",
        choices: function () {
          const query = "SELECT * FROM department";
          return connection
            .promise()
            .query(query)
            .then((departments) => {
              return departments[0].map((department) => {
                return {
                  name: department.name,
                  value: department.id,
                };
              });
            });
        },
      },
    ])
    .then(function (answer) {
      const query = "INSERT INTO role SET ?";
      connection.query(
        query,
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId,
        },
        function (err, data) {
          if (err) throw err;
          console.log("Role added.");
          viewRole();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "First Name: ",
      },
      {
        name: "lastName",
        type: "input",
        message: "Last Name:",
      },
      {
        name: "roleId",
        type: "list",
        message: "Role ID:",
        choices: function () {
          const query = "SELECT * FROM role";
          return connection
            .promise()
            .query(query)
            .then((roles) => {
              return roles[0].map((role) => {
                return {
                  name: role.title,
                  value: role.id,
                };
              });
            });
        },
      },
      {
        name: "managerId",
        type: "list",
        message: "Manager ID:",
        choices: function () {
          const query = "SELECT * FROM employee";
          return connection
            .promise()
            .query(query)
            .then((employees) => {
              return employees[0].map((employee) => {
                return {
                  name: employee.first_name + " " + employee.last_name,
                  value: employee.id,
                };
              });
            });
        },
      },
    ])
    .then(function (answer) {
      const query = "INSERT INTO employee SET ?";
      connection.query(
        query,
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        function (err, data) {
          if (err) throw err;
          console.log("Employee added.");
          viewEmployee();
        }
      );
    });
}

function viewDepartment() {
  const query = "SELECT * FROM department";
  connection.query(query, function (err, data) {
    if (err) throw err;
    console.table(data);
    start_app();
  });
}

function viewRole() {
  const query =
    "SELECT role.id, role.title, role.salary, department.name AS department_name FROM role JOIN department ON role.department_id = department.id;";
  connection.query(query, function (err, data) {
    if (err) throw err;
    console.table(data);
    start_app();
  });
}

function viewEmployee() {
  const query = `SELECT 
      employee.id, employee.first_name, employee.last_name, role.title AS role, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id 
    LEFT JOIN department ON role.department_id = department.id;`;
  connection.query(query, function (err, data) {
    if (err) throw err;
    console.table(data);
    start_app();
  });
}

function updateEmployeeRole() {
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices: function () {
            const choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              let fullName = results[i].first_name + " " + results[i].last_name;
              choiceArray.push(fullName);
            }
            return choiceArray;
          },
          message: "Choose employee:",
        },
        {
          name: "newRole",
          type: "list",
          message: "Updated Role:",
          choices: function () {
            const query = "SELECT * FROM role";
            return connection
              .promise()
              .query(query)
              .then((roles) => {
                return roles[0].map((role) => {
                  return {
                    name: role.title,
                    value: role.id,
                  };
                });
              });
          },
        },
      ])
      .then(function (answer) {
        function currentId() {
          for (let i = 0; i < results.length; i++) {
            if (
              answer.choice ===
              results[i].first_name + " " + results[i].last_name
            ) {
              return results[i].id;
            }
          }
        }
        const query = "UPDATE employee SET ? WHERE ?";
        connection.query(
          query,
          [
            {
              role_id: answer.newRole,
            },
            {
              id: currentId(),
            },
          ],
          function (err, data) {
            if (err) throw err;
            console.log("Update successful.");
            viewEmployee();
          }
        );
      });
  });
}

// Testing Delete functionality.
function deleteEmployee() {
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices: function () {
            const choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              let fullName = results[i].first_name + " " + results[i].last_name;
              choiceArray.push(fullName);
            }
            return choiceArray;
          },
          message: "Choose employee:",
        },
      ])
      .then((answer) => {
        function currentId() {
          for (let i = 0; i < results.length; i++) {
            if (
              answer.choice ===
              results[i].first_name + " " + results[i].last_name
            ) {
              return results[i].id;
            }
          }
        }
        const query = "DELETE FROM employee WHERE ?";
        connection.query(
          query,
          [
            {
              id: currentId(),
            },
          ],
          function (err, data) {
            if (err) throw err;
            console.log("Delete successful.");
            viewEmployee();
          }
        );
      });
  });
}

function intro() {
  const intro = `
  +----------------------------------------------------------------------------+
  |                                                                            |
  |      ██╗ █████╗ ██╗  ██╗███████╗                                           |
  |      ██║██╔══██╗██║ ██╔╝██╔════╝                                           |
  |      ██║███████║█████╔╝ █████╗                                             |
  | ██   ██║██╔══██║██╔═██╗ ██╔══╝                                             |
  | ╚█████╔╝██║  ██║██║  ██╗███████╗                                           |
  |  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝                                           |
  |                                                                            |
  |                                                                            |
  |  ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗  ███████╗   |
  |  ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝  ██╔════╝   |
  |  █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗    █████╗     |
  |  ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝    ██╔══╝     |
  |  ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗  ███████╗   |
  |  ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝  ╚══════╝   |
  |                                                                            |
  |  ██████╗███╗   ███╗███████╗                                                |
  |  ██╔════╝████╗ ████║██╔════╝                                               |
  |  ██║     ██╔████╔██║███████╗                                               |
  |  ██║     ██║╚██╔╝██║╚════██║                                               |
  |  ╚██████╗██║ ╚═╝ ██║███████║                                               |
  |   ╚═════╝╚═╝     ╚═╝╚══════╝                                               |
  |                                                                            |
  +----------------------------------------------------------------------------+
  `;

  console.log(intro);
}

function exit() {
  const outro = `
  +------------------------------------------------------------------+
  |                                                                  |
  | █████████╗██╗  ██╗ █████╗ ███╗   ██╗██╗  ██╗███████╗    ██╗      |
  |  ╚══██╔══╝██║  ██║██╔══██╗████╗  ██║██║ ██╔╝██╔════╝    ██║      |
  |     ██║   ███████║███████║██╔██╗ ██║█████╔╝ ███████╗    ██║      |
  |     ██║   ██╔══██║██╔══██║██║╚██╗██║██╔═██╗ ╚════██║    ╚═╝      |
  |     ██║   ██║  ██║██║  ██║██║ ╚████║██║  ██╗███████║    ██╗      |
  |     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝    ╚═╝      |
  |                                                                  |
  +------------------------------------------------------------------+
  `;

  console.log(outro);
}
