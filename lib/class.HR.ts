
/** select column_name, data_type, data_precision, data_length, nullable from all_tab_columns where table_name like '%EMPLOY%' or owner='HR';
 */
/**"COLUMN_NAME"                 "DATA_TYPE"                   "DATA_PRECISION"              "DATA_LENGTH"                 "NULLABLE"                    
"EMPLOYEE_ID"                 "NUMBER"                      "6"                           "22"                          "N"                           
"FIRST_NAME"                  "VARCHAR2"                    ""                            "20"                          "Y"                           
"LAST_NAME"                   "VARCHAR2"                    ""                            "25"                          "N"                           
"EMAIL"                       "VARCHAR2"                    ""                            "25"                          "N"                           
"PHONE_NUMBER"                "VARCHAR2"                    ""                            "20"                          "Y"                           
"HIRE_DATE"                   "DATE"                        ""                            "7"                           "N"                           
"JOB_ID"                      "VARCHAR2"                    ""                            "10"                          "N"                           
"SALARY"                      "NUMBER"                      "8"                           "22"                          "Y"                           
"COMMISSION_PCT"              "NUMBER"                      "2"                           "22"                          "Y"                           
"MANAGER_ID"                  "NUMBER"                      "6"                           "22"                          "Y"                           
"DEPARTMENT_ID"               "NUMBER"                      "4"                           "22"                          "Y"                           
 */

export interface IEmployee{
    EMPLOYEE_ID:number;
    FIRST_NAME:string;
    LAST_NAME:string;
    EMAIL:string;
    PHONE_NUMBER:string;
    HIRE_DATE:Date;
    JOB_ID:string;
    SALARY:number;
    COMMISSION_PCT:number;
    MANAGER_ID:number;
    DEPARTMENT_ID:number;
}

export function getKeyIndexPos(metaData: { name: string }[]): { name: string, index: number }[] {
    return metaData.map((metaDataItem: any, index: number) => {
        return { ...metaDataItem, index };
    });
    //return []
}

export function getEmployeeObject(employeeRow: any[], metaData: { name: string }[]): IEmployee {
    const emp: IEmployee = {
        EMPLOYEE_ID:     employeeRow[metaData.findIndex(col => col.name == "EMPLOYEE_ID")],
        FIRST_NAME:      employeeRow[metaData.findIndex(col => col.name == 'FIRST_NAME')],
        HIRE_DATE:       employeeRow[metaData.findIndex(col => col.name == 'HIRE_DATE')],
        DEPARTMENT_ID:   employeeRow[metaData.findIndex(col => col.name == 'DEPARTMENT_ID')],
        COMMISSION_PCT:  employeeRow[metaData.findIndex(col => col.name == 'COMMISSION_PCT')],
        EMAIL:           employeeRow[metaData.findIndex(col => col.name == 'EMAIL')],
        JOB_ID:          employeeRow[metaData.findIndex(col => col.name == 'JOB_ID')],
        LAST_NAME:       employeeRow[metaData.findIndex(col => col.name == 'LAST_NAME')],
        MANAGER_ID:      employeeRow[metaData.findIndex(col => col.name == 'MANAGER_ID')],
        PHONE_NUMBER:    employeeRow[metaData.findIndex(col => col.name == 'PHONE_NUMBER')],
        SALARY:          employeeRow[metaData.findIndex(col => col.name == 'SALARY')],
    };
    return emp
}

