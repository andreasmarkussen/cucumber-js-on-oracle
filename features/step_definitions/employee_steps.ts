//const assert = require('assert')
import { expect, assert } from 'chai';
import { getEmployeeObject, getKeyIndexPos, IEmployee } from '../../lib/class.HR'
import { DatabaseEmployeeList, GenericEmployeeList } from '../../lib/databaseEmployeeList';

import { Given, When, Then, setDefaultTimeout } from 'cucumber';
import { _call_ADD_JOB_HISTORY } from '../../lib/generated/ADD_JOB_HISTORY.target';
//const { Given, When, Then, setDefaultTimeout } = require('cucumber')

setDefaultTimeout(60000);

let globalCurrentEmployee: IEmployee;
let globalEmployeeName: string;

Given('the Employee {string} has a salary of {int}', async function (employee_name: string, salary: number) {
  const employeeList = await this.contextEmployeeList();
  const currentEmployee: IEmployee = await employeeList.getEmployeeByName(employee_name);
  expect(currentEmployee.SALARY, "Salary must be as expected").to.eq(salary);
  globalCurrentEmployee = currentEmployee;
  globalEmployeeName = employee_name;
  // Possible expansion - if the salary is needed to be different then change it.
});

When('he gets a {int}% raise', async function (int) {
  const employeeList: DatabaseEmployeeList = await this.actionEmployeeList();
  employeeList.giveEmployeeRaise(globalCurrentEmployee.EMPLOYEE_ID, int / 100);
});

Then('his new salary is {int}', async function (salary) {
  const employeeList = await this.contextEmployeeList();
  const currentEmployee: IEmployee = await employeeList.getEmployeeByName(globalEmployeeName);
  expect(currentEmployee.SALARY, "Salary must be as expected").to.eq(salary);
});

Given('the Employee {string} has worked {int} places', async function (employee_name: string, placesWorked: number) {
  const employeeList: GenericEmployeeList = await this.contextEmployeeList();
  const currentEmployee: IEmployee = await employeeList.getEmployeeByName(employee_name);
  const actualPlacesWorked = await employeeList.numberOfPlacesWorked(currentEmployee.EMPLOYEE_ID);
  expect(actualPlacesWorked, "No job history expected").to.eq(placesWorked);
  globalCurrentEmployee = currentEmployee;
  globalEmployeeName = employee_name;
});

//When he joins the 'IT' Department as an 'IT_PROG'
When('he joins the {string} Department as an {string}', async function (department_name: string, job_id:string) {
  const employeeList: GenericEmployeeList = await this.actionEmployeeList();
  await employeeList.joinDepartment(globalCurrentEmployee.EMPLOYEE_ID, department_name,job_id);
});

Then('he has worked {int} places', async function (placesWorked: number) {
  const employeeList: GenericEmployeeList = await this.outcomeEmployeeList();
  const actualPlacesWorked = await employeeList.numberOfPlacesWorked(globalCurrentEmployee.EMPLOYEE_ID);
  expect(actualPlacesWorked, "Job history expected").to.eq(placesWorked);
});
