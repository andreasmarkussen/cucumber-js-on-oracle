import { expect, assert } from 'chai';
import * as fs from "fs";
import * as OD from '../../lib/OracleDatabaseDriver';
import * as TSG from '../../lib/TypeScriptGenerator';
const od = OD.OracleDatabaseDriver.instance();
import { Given, When, Then } from 'cucumber';
import { IPlsqlProcedure } from '../../lib/OracleDbInterfaces';

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping) {

  string += "";
  subString += "";
  if (subString.length <= 0) return (string.length + 1);

  var n = 0,
      pos = 0,
      step = allowOverlapping ? 1 : subString.length;

  while (true) {
      pos = string.indexOf(subString, pos);
      if (pos >= 0) {
          ++n;
          pos += step;
      } else break;
  }
  return n;
}

declare module "cucumber" {
  interface World {
    generatedFileName:string;
    generatedFileContent:string;
    proceduresMetaData: IPlsqlProcedure[];
    allGeneratedCode: string[];
    }
}
//? Given a procedure exists called 'ADD_JOB_HISTORY'
Given('a procedure exists called {string}', async function (procedureName: string) {
  const returnedProceduresMetaData = await od.proceduresMetadata(`object_name=UPPER('${procedureName}')`);
  expect(returnedProceduresMetaData.length).to.eq(1);
  this.proceduresMetaData = returnedProceduresMetaData;
});


Given('{int} procedures exist with {string}', async function (expectedNumOfProcedures:number, whereClause:string) {
  const returnedProceduresMetaData = await od.proceduresMetadata(whereClause);
  expect(returnedProceduresMetaData.length).to.eq(expectedNumOfProcedures);
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

Then('the all the generated files contain only one function', async function () {
  // Write code here that turns the phrase above into concrete actions
  console.log("All generated code",this.allGeneratedCode);
  this.allGeneratedCode.forEach(codeSnippet => {
    const async_functions_count = occurrences(codeSnippet,'export async',false);
    console.log("CodeSnippet",async_functions_count)
    expect(async_functions_count,"Found: "+ async_functions_count+"\nOnly one export: \n\n" + codeSnippet).to.equal(1);
  })
  //return 'pending';
});