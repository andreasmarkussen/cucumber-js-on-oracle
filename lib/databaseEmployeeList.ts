import { IEmployee, getEmployeeObject } from "./class.HR";
//import * as oracledb from 'oracledb';
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.ARRAY;
const db_config = require('../oracle.config.js');

//const Sequelize = require('sequelize');

export interface GenericEmployeeList{
    start:()=>Promise<any>;
}

export class DatabaseEmployeeList implements GenericEmployeeList{
    public connection:any;
    constructor(){
    }

    public async start():Promise<void>{
        if(db_config.module.authInfo === undefined){
            console.error("DB CONFIG GIVEN",db_config);
            throw new Error("No Oracle Config information is available" + JSON.stringify(db_config));
            
        }
        this.connection = await oracledb.getConnection(db_config.module.authInfo);
    }

    public async getEmployeeByName(employee_name:string):Promise<IEmployee>{
        const employee_name_no_space = employee_name.replace(' ','');
        let result = await this.connection.execute( `SELECT * FROM employees WHERE concat(FIRST_NAME,LAST_NAME) = '${employee_name_no_space}' `);
        console.log("Result object",result);
        if(typeof result == "object"){
            let empList:{rows:any[],metaData:any[]} = result;
            let firstEmp = empList.rows.pop();
            return getEmployeeObject(firstEmp,empList.metaData);
        }
        return result;
    }

    public async giveEmployeeRaise(employee_id:number, raise:number):Promise<any>{
        if(employee_id === null || employee_id === undefined){
            throw new Error("Employee ID was null or undefined, please send a proper employee_id");
        }
        let result = await this.connection.execute( `UPDATE employees SET SALARY = (SALARY)*(1+${raise}) WHERE employee_id = '${employee_id}' `);
    }

}
