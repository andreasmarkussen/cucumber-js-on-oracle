import { IEmployee, getEmployeeObject } from "./class.HR";
//import * as oracledb from 'oracledb';
import * as OraDB from 'oracledb';
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.ARRAY;
const db_config = require('../oracle.config.js');

//const Sequelize = require('sequelize');

export abstract class GenericEmployeeList {
    abstract joinDepartment(employee_id: number, department_name: string): Promise<void>;
    abstract start(): Promise<void>;
    abstract numberOfPlacesWorked(employee_id: number): Promise<number>;
    abstract getEmployeeByName(employee_name: string): Promise<IEmployee>;
    abstract giveEmployeeRaise(employee_id: number, raise: number): Promise<any>
}

interface args_add_job_history {
    p_emp_id: number, p_start_date: Date, p_end_date: Date, p_job_id: string, p_department_id: number
};

export class DatabaseEmployeeList implements GenericEmployeeList {
    public connection: OraDB.IConnection;
    constructor() {
    }

    public async start(): Promise<void> {
        if (db_config.module.authInfo === undefined) {
            console.error("DB CONFIG GIVEN", db_config);
            throw new Error("No Oracle Config information is available" + JSON.stringify(db_config));

        }
        this.connection = await oracledb.getConnection(db_config.module.authInfo);
    }

    public async getEmployeeByName(employee_name: string): Promise<IEmployee> {
        const employee_name_no_space = employee_name.replace(' ', '');
        let result = await this.sqlExec(`SELECT * FROM employees WHERE concat(FIRST_NAME,LAST_NAME) = '${employee_name_no_space}' `);
        //    console.log("Result object",result);
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
        console.log("SQL", sql);
        try {
            return await this.connection.execute(sql);
        } catch (error) {
            console.log("Error executing SQL", error);
            console.log("SQL", sql);
            throw error;
            return;
        }
    }

    public async getDepartmentByName(department_name): Promise<number> {
        const res = await this.sqlExec(`select department_id from SYS.departments where department_name = '${department_name}' `);
        console.log("getDepartment", department_name, res)
        if (res)
            return res.rows.pop().pop();
        else
            throw new Error(`Unable to find department '${department_name}'`)
    }

    public async joinDepartment(employee_id: number, department_name: string): Promise<void> {
        let today: Date = new Date();
        let next_year: Date = new Date();
        next_year.setFullYear(today.getFullYear() + 1);
        //const department_id:number = await this.getDepartmentByName(department_name);
        const department_id = 60;
        //console.log("Department ",department_id);
        const job_id: string = 'IT_PROG';
        await this.call_add_job_history(employee_id, today, next_year, job_id, department_id);
    }
    /**
     * ## "PROCEDURE add_job_history
    #     (  p_emp_id          job_history.employee_id%type
    #      , p_start_date      job_history.start_date%type
    #      , p_end_date        job_history.end_date%type
    #      , p_job_id          job_history.job_id%type
    #      , p_department_id   job_history.department_id%type
    #      )
    #   IS
     */

    what_is_my_name() {
        return arguments.callee;
    }

    async call_add_job_history(p_emp_id: number, p_start_date: Date, p_end_date: Date, p_job_id: string, p_department_id: number): Promise<OraDB.IExecuteReturn> {
        const plsql = DatabaseEmployeeList.add_job_history(p_emp_id, p_start_date, p_end_date, p_job_id, p_department_id);
        try {
            const res = this.call_plsql(plsql);
            //   const job_his = await this.get_table_content("SYS.job_history");
            // console.log("Job history table",job_his.rows);
            return res;


        } catch (error) {
            //this.last_error = error;
            console.log("Error happened while doing stuff", error);
            //console.error(error);
        }
        return null;
    }

    static add_job_history(p_emp_id, p_start_date, p_end_date, p_job_id, p_department_id): string {
        const own_name = (new Error().stack.split("\n")[1].trim().split(" ")[1].split(".")[1]);
        const procedure_name = 'add_job_history';
        const ar_args = Array.from(arguments);
        let arguments_string: string = "";
        //const front_space = " ".repeat(own_name.length); // Name given in lack of better - number of spaces in front of arg
        const types = ['Number', 'Date', 'Date', 'String', 'Number'];
        if (ar_args.length) {
            //arguments_string =  '"'+ar_args.join(`",\n${front_space}"`)+'"';
            arguments_string = DatabaseEmployeeList.format_args(ar_args, types);
        }
        const block_body = `${procedure_name}(${arguments_string})`;
        const basic_block = `DECLARE \n BEGIN \n ${block_body};\n END; \n`;
        return basic_block;
    }

    async call_plsql(basic_block: string): Promise<OraDB.IExecuteReturn> {
        return await this.sqlExec(basic_block);
    }

    public async get_table_content(table_name: string): Promise<OraDB.IExecuteReturn> {
        return await this.sqlExec(`SELECT * FROM ${table_name}; `);
    }

    public static format_type_date(element: any) {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let current_datetime = new Date(element)
        let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear()
        //console.log("Formated date", formatted_date)
        return `to_date('${formatted_date}','DD-MON-YYYY')`;
    }

    public static format_type(element: any, type: string) {
        switch (type) {
            case 'Number': return element;
            case 'String': return `'${element}'`;
            case 'Date': return DatabaseEmployeeList.format_type_date(element);
            default: return "unknown type" + element.type;
        }
    }

    public static format_args(args: any[], types: string[]) {
        const sep = ',\n';
        let count = 0;
        const new_ar = args.map((element) => DatabaseEmployeeList.format_type(element, types[count++]));
        //console.log("Format args",args,new_ar);
        return new_ar.join(sep);
    }
}

//const d = new DatabaseEmployeeList();
//const r = DatabaseEmployeeList.add_job_history(1,new Date(Date.now()),new Date(Date.now()),4,5);