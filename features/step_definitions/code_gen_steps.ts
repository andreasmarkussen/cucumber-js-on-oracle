import { expect, assert } from 'chai';
import * as fs from "fs";
import * as OD from '../../lib/OracleDatabaseDriver';
import * as TSG from '../../lib/TypeScriptGenerator';

import { Given, When, Then } from 'cucumber';
import { IPlsqlProcedure } from '../../lib/OracleDbInterfaces';

declare module "cucumber" {
  interface World {
    generatedFileName:string;
    generatedFileContent:string;
    proceduresMetaData: IPlsqlProcedure[];
    }
}
//? Given a procedure exists called 'ADD_JOB_HISTORY'
Given('a procedure exists called {string}', async function (procedureName: string) {
  let IPlsqlProcedure = 0;

  const od = new OD.OracleDatabaseDriver();
  const returnedProceduresMetaData = await od.proceduresMetadata(`object_name=UPPER('${procedureName}')`);
  expect(returnedProceduresMetaData.length).to.eq(1);
  this.proceduresMetaData = returnedProceduresMetaData;
});

// ? And the procedure has these arguments
// | ARGUMENT_NAME   | DATA_TYPE |
// | P_EMP_ID        | NUMBER    |
// | P_START_DATE    | DATE      |
// | P_END_DATE      | DATE      |
// | P_JOB_ID        | VARCHAR2  |
// | P_DEPARTMENT_ID | NUMBER    |
Given('the procedure has these arguments', async function (expectedArgumentsDataTable) {
  if (this.proceduresMetaData === undefined)
    throw new Error("The step 'a procedure exists called..' must be called in advance");
  const actualProcedure = this.proceduresMetaData[0];
  const dtRows: any[] = expectedArgumentsDataTable.rows();
  const expectedProcedureArguments = dtRows.map(dtRow => ({ argument_name: dtRow[0], data_type: dtRow[1] }));

  /** - UnComment to see the different ways to see a DataTable
   console.log("Target ",actualProcedure.arguments);
   console.log("Types - rows()",expectedProcedureArguments);
   console.log("Types - rowsHash()",dataTable.rowsHash());
   console.log("Types - raw()",dataTable.raw());
   console.log("Types - hashes()",dataTable.rowsHash());*/

  assert.deepEqual(actualProcedure.arguments, expectedProcedureArguments, "Deep Equal");
});

//? When TypeScript code is generated
When('TypeScript code is generated', async function () {
  let tsgOracle = new TSG.OracleTypeScriptStrategy();
  this.allGeneratedCode = tsgOracle.addProcedures(this.proceduresMetaData);
});

// ? Then code contains these strings in sequence
// | source_code                |
// | _generate_add_job_history( |
// | p_emp_id                   |
Then('code contains these strings in sequence', async function (dataTable) {
  const hashTable: [] = dataTable.hashes();
  const firstFile = this.allGeneratedCode.pop();
  this.generatedFileContent = firstFile;
  hashTable.forEach((row: { source_code: string }) => {
     expect(firstFile, " Line check").to.include(row.source_code);
  });
});

///? And the generated file is similar to './lib/generated/'
Then('the generated file is similar to {string}', async function (fileName:string) {
  const generatedFileContent = fs.readFileSync(fileName.replace('.target',''),'utf8');
  const targetFileContent = fs.readFileSync(fileName,'utf8');
  const removeLinesContaining = (text:string,removalTrigger:string)=>{
    const windowsNewLinePos = text.search("\n\r");
    const unixNewLinePos = text.search("\n");
    let detectedNewLine = (windowsNewLinePos == unixNewLinePos) ? '\n\r' : '\n';
    const lines = text.split(detectedNewLine);
    return lines.filter(line=>!line.includes(removalTrigger)).join(detectedNewLine);
  }
  expect(removeLinesContaining(targetFileContent,'Timestamp'),"Target file and Generated files must match")
      .to.equal(removeLinesContaining(generatedFileContent,'Timestamp'));
});
