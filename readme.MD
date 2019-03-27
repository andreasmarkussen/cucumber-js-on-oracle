# Cucumber on OracleDB - the fast way

## Purpose

To make a Proof of concept on how to test Oracle Database functionality via Cucumber JS, TypeScript and Code generation.

The POC is inspired by the [SubSecond TDD - Todo list](https://github.com/subsecondtdd/todo-subsecond) by [Aslak Hellesøy](https://twitter.com/aslak_hellesoy), but rewritten to be using TypeScript and Oracle. And it does not follow the intent of Aslaks project, since I wanted to show the Auto generation parts.

I favored Developer speed over test executing speed, which is why I used Typescript and Code Generation. 

## Key Features

### Execute Oracle SQL queries and PLSQL code

You can access and run PLSQL and SQL from TypeScript using the node-oracledb drivers, however there are some plumping that needs to be done.
However, see the next feature. 

### Auto generate Code to call your PLSQL

A pain point of using Cucumber or any other automation framework, is that you tend to duplicate code when changing languages. E.g. if your test is in JavaScript and your code is in PLSQL. Generating code can be a good and secure choice.

See below the generated code for the add_job_history() procedure from the Oracle HR Schema.

```TypeScript
    //Generated file - DO NOT ALTER
    //Timestamp:2019-03-27T11:43:09.887Z
    //Generated using TypeScriptGenerator.ts 
    import * as OraDB from 'oracledb';
    import * as ODAO from '../OracleDatabaseDriver';
    const oracledb = require('oracledb');
    const formatDate = ODAO.OracleDatabaseDriver.plsqlDateFromJavaScriptDate;
    export async function _call_ADD_JOB_HISTORY(P_EMP_ID: number,
        P_START_DATE: Date,
        P_END_DATE: Date,
        P_JOB_ID: string,
        P_DEPARTMENT_ID: number){
    const o = ODAO.OracleDatabaseDriver.instance();
    let result = await o.exec(`
                DECLARE 
                BEGIN 
                    ADD_JOB_HISTORY( ${P_EMP_ID},
                         ${formatDate(P_START_DATE)}, 
                         ${formatDate(P_END_DATE)},
                        '${P_JOB_ID}', 
                        ${P_DEPARTMENT_ID});
                END;
                `);
    }
```

This enables you to make simpler code for your CucumberJS step_handlers:

Imagine a step handler such as this

```TypeScript
When('he joins Department {string}', async function (department_name: string) {
  const employeeList: GenericEmployeeList = await this.actionEmployeeList();
  await employeeList.joinDepartment(globalCurrentEmployee.EMPLOYEE_ID, department_name);
});
```

This uses a method on the Class [employeeList](https://github.com/andreasmarkussen/cucumber-js-on-oracle/blob/master/lib/databaseEmployeeList.ts) called joinDepartment

```TypeScript
    public async joinDepartment(employee_id: number, department_name: string, job_id:string): Promise<void> {
        let today: Date = new Date();
        let next_year: Date = new Date();
        next_year.setFullYear(today.getFullYear() + 1);
        const department_id = await this.getDepartmentByName(department_name);
        await _call_ADD_JOB_HISTORY(employee_id, today, next_year, job_id, department_id);
    }
```

## Usage

1. Checkout the Repository
1. Install the npm packages
1. Inspect the feature files
1. Inspect the unit test specifications

## Dependencies

* Cucumber: Framework to run BDD Test automation
* Mocha: Unit Test framework to run programmer style TDD
* Oracle Node js: Oracle Node JS driver

## Considered dependencies

The templating for the code generation is now done inline, 
it could be done using in-file templates Mustache
* [Mustache: Templating Engine for JavaScript](https://github.com/janl/mustache.js)


## Notes

Comments are welcome, and I would love to get some issues if you find things hard to use.

## Todo

1. Auto-generate packages to Typescript packages
1. Auto-generate row types for each Table
1. Auto-generate access functionality for all tables 

## References

In order to be able to do the Technical things with this code, then there are a few technical things you be familiar with. 
If not, then read below.

## CucumberJS


See [The Cucumber JS repository on GitHub](https://github.com/cucumber/cucumber-js/)

## Typescript

See [typescriptlang.org](http://typescriptlang.org) 

* (Typescript - Interface vs Type)[https://www.educba.com/typescript-type-vs-interface/]

### PlSql Guides

If you want to know more about Plsql read the book (Plsql By Example){https://webdiis.unizar.es/asignaturas/BD/transparenciasBD/otros_Documentos/Oracle%20PL%20SQL%20by%20Example.pdf}
