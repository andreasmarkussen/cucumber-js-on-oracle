//const assert = require('assert')
import {expect, assert} from 'chai';
import { getEmployeeObject, getKeyIndexPos, IEmployee } from '../../lib/class.HR'
import { DatabaseEmployeeList} from '../../lib/DatabaseEmployeeList';
 
import { Given, When, Then, setDefaultTimeout} from 'cucumber';
//const { Given, When, Then, setDefaultTimeout } = require('cucumber')

setDefaultTimeout(60000);

let globalCurrentEmployee:IEmployee;
let globalEmployeeName:string;

Given('the Employee {string} has a salary of {int}', async function (employee_name:string, salary:number) {
  // Write code here that turns the phrase above into concrete actions
  //const currentEmployee = this.context.employees(employee_name);
  const employeeList = await this.contextEmployeeList();
  const currentEmployee:IEmployee = await employeeList.getEmployeeByName(employee_name);
  expect(currentEmployee.SALARY,"Salary must be as expected").to.eq(salary);
  globalCurrentEmployee=currentEmployee;
  globalEmployeeName = employee_name;
 // expect(salary, "Salary must be as expected").to.be();
  
  // FIND the emp called employee_name
  // Ensure that the value is salary
  });

When('he gets a {int}% raise', async function (int) {
  const employeeList:DatabaseEmployeeList = await this.actionEmployeeList();
  employeeList.giveEmployeeRaise(globalCurrentEmployee.EMPLOYEE_ID,int/100);
  // Write code here that turns the phrase above into concrete actions
    // this.action.currentEmployee.setRaise(int);
 //   return 'pending';
  });

Then('his new salary is {int}', async function (salary) {
  //console.log("World",this);
  const employeeList = await this.contextEmployeeList();
  const currentEmployee:IEmployee = await employeeList.getEmployeeByName(globalEmployeeName);
  expect(currentEmployee.SALARY,"Salary must be as expected").to.eq(salary);


  globalCurrentEmployee=currentEmployee;
    // Write code here that turns the phrase above into concrete actions
    // this.outcome.currentEmployee.getRaise()
    // assert - 
//    return 'pending';
  });



// Given('there is/are already {int} todo(s)', async function(count) {
//   const todoList = await this.contextTodoList()
//   for (let i = 0; i < count; i++)
//     await todoList.addTodo({ text: `Todo ${i}` })
// })

// When('I add {string}', async function(text) {
//   const todoList = await this.actionTodoList()
//   await todoList.addTodo({ text })
// })

// Then('the text of the {ordinal} todo should be {string}', async function(index, text) {
//   const todoList = await this.outcomeTodoList()
//   const todos = await todoList.getTodos()
//   assert.equal(todos[index].text, text)
// })