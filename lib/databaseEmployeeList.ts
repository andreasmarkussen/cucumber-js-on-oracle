import { IEmployee, getEmployeeObject } from "./class.HR";
import * as OraDB from 'oracledb';
const oracledb = require('oracledb');
import * as ODAO from './OracleDatabaseDriver';
import { OracleTypeScriptStrategy } from "./TypeScriptGenerator";
import { _call_ADD_JOB_HISTORY } from "./generated/ADD_JOB_HISTORY.target";
oracledb.outFormat = oracledb.ARRAY;
const db_config = require('../oracle.config.js');

export abstract class GenericEmployeeList {
    abstract joinDepartment(employee_id: number, department_name: string, job_id:string): Promise<void>;
    abstract start(): Promise<void>;
    abstract numberOfPlacesWorked(employee_id: number): Promise<number>;
    abstract getEmployeeByName(employee_name: string): Promise<IEmployee>;
    abstract giveEmployeeRaise(employee_id: number, raise: number): Promise<any>
}

export class DatabaseEmployeeList implements GenericEmployeeList {
    public od:ODAO.OracleDatabaseDriver;
    constructor() {
        //this.od.start();
        this.od = new ODAO.OracleDatabaseDriver();
    }

    public async start(): Promise<void> {
        await this.od.start();
    }

    public async getEmployeeByName(employee_name: string): Promise<IEmployee> {
        const employee_name_no_space = employee_name.replace(' ', '');
        let result = await this.sqlExec(`SELECT * FROM employees WHERE concat(FIRST_NAME,LAST_NAME) = '${employee_name_no_space}' `);
        if (typeof result == "object") {
            let empList = result;
            let firstEmp = empList.rows.pop();
            return getEmployeeObject(firstEmp, empList.metaData);
        }
        return result;
    }

    public async giveEmployeeRaise(employee_id: number, raise: number): Promise<any> {
        if (employee_id === null || employee_id === undefined) {
            throw new Error("Employee ID was null or undefined, please send a proper employee_id");
        }
        let result = await this.sqlExec(`UPDATE employees SET SALARY = (SALARY)*(1+${raise}) WHERE employee_id = '${employee_id}' `);
    }

    public async numberOfPlacesWorked(employee_id: number): Promise<number> {
        const res = await this.sqlExec(`SELECT count(*) count FROM job_history WHERE employee_id = ${employee_id} `);
        return res.rows.pop().pop();
    }

    public async sqlExec(sql: string): Promise<any> {
        try {
            return await this.od.exec(sql);
        } catch (error) {
            console.error("Error executing SQL: ", sql);
            console.log("Error code: ", error);
            throw error;
            return;
        }
    }

    public async getDepartmentByName(department_name): Promise<number> {
        const res = await this.sqlExec(`select department_id from departments where department_name = '${department_name}' `);
        if (res)
            return res.rows.pop().pop();
        else
            throw new Error(`Unable to find department '${department_name}'`)
    }

    public async joinDepartment(employee_id: number, department_name: string, job_id:string): Promise<void> {
        let today: Date = new Date();
        let next_year: Date = new Date();
        next_year.setFullYear(today.getFullYear() + 1);
        const department_id = await this.getDepartmentByName(department_name);
        await _call_ADD_JOB_HISTORY(employee_id, today, next_year, job_id, department_id);
    }

    /** Hand coded alternative part 1  - Calling the code (not in use, but there for demo) */
    async call_add_job_history(p_emp_id: number, p_start_date: Date, p_end_date: Date, p_job_id: string, p_department_id: number): Promise<OraDB.IExecuteReturn> {
        const plsql_code_for_the_call = DatabaseEmployeeList.generate_code_for_add_job_history(p_emp_id, p_start_date, p_end_date, p_job_id, p_department_id);
        try {
            return this.call_plsql(plsql_code_for_the_call);
        } catch (error) {
            console.log("Error happened while doing stuff", error);
            throw error;
        }
    }
    
    /** Hand coded alternative part 2 - staging or creating the code */
    static generate_code_for_add_job_history(p_emp_id, p_start_date, p_end_date, p_job_id, p_department_id): string {
        const procedure_name = 'add_job_history';
        const ar_args = Array.from(arguments);
        let arguments_string: string;
        const types = ['Number', 'Date', 'Date', 'String', 'Number'];
        if (ar_args.length) {
            arguments_string = OracleTypeScriptStrategy.formatArgumentString(ar_args, types);
        }
        return OracleTypeScriptStrategy.generatePlSqlCallBlock(procedure_name,arguments_string);
    }

    async call_plsql(basic_block: string): Promise<OraDB.IExecuteReturn> {
        return await this.sqlExec(basic_block);
    }

    public async get_table_content(table_name: string): Promise<OraDB.IExecuteReturn> {
        return await this.sqlExec(`SELECT * FROM ${table_name}; `);
    }

    // public static format_type_date(element: any) {
    //     const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    //     let current_datetime = new Date(element)
    //     let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear()
    //     //console.log("Formated date", formatted_date)
    //     return `to_date('${formatted_date}','DD-MON-YYYY')`;
    // }

    // public static format_type(element: any, type: string) {
    //     switch (type) {
    //         case 'Number': return element;
    //         case 'String': return `'${element}'`;
    //         case 'Date': return DatabaseEmployeeList.format_type_date(element);
    //         default: return "unknown type" + element.type;
    //     }
    // }

}

//const d = new DatabaseEmployeeList();
//const r = DatabaseEmployeeList.add_job_history(1,new Date(Date.now()),new Date(Date.now()),4,5);