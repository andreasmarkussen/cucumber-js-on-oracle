//Generated file - DO NOT ALTER
//Generated using TypeScriptGenerator.ts 
import * as OraDB from 'oracledb';
import * as ODAO from '../OracleDatabaseDriver';
const oracledb = require('oracledb');
const formatDate = ODAO.OracleDatabaseDriver.plsqlDateFromJavaScriptDate;
export async function _call_UPDATE_JOB_HISTORY(){
  const o = ODAO.OracleDatabaseDriver.instance();
  let result = await o.exec(`
            DECLARE 
            BEGIN 
                UPDATE_JOB_HISTORY();
            END;
            `);
}