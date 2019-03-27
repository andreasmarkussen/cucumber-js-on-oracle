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
                ADD_JOB_HISTORY(${P_EMP_ID}, ${formatDate(P_START_DATE)}, ${formatDate(P_END_DATE)}, '${P_JOB_ID}', ${P_DEPARTMENT_ID});
            END;
            `);
}