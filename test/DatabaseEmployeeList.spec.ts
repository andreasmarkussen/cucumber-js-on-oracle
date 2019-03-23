import "mocha";
import { expect } from "chai";
import * as del from "../lib/databaseEmployeeList";
import { IEmployee, getEmployeeObject, getKeyIndexPos } from "../lib/class.HR"

describe('PLSQL ', () => {

  it('should generate PLSQL in a basic block', () => {
    const plsql = del.DatabaseEmployeeList.add_job_history(1, new Date('01-01-2019'), new Date('01-01-2019'), 'IT_PROG', 5);
    expect(plsql).to.contain("BEGIN");
    expect(plsql).to.contain("END");
    expect(plsql).to.contain("2019");
  });

  it('should generate PLSQL in a basic block with correct types', () => {
    const plsql = del.DatabaseEmployeeList.add_job_history(1, new Date('01-01-2019'), new Date('01-01-2019'), 'IT_PROG', 5);
    expect(plsql).to.contain("(1,");
    expect(plsql).to.contain("'IT_PROG'");
    expect(plsql).to.contain("add_job_history");
  });

});
