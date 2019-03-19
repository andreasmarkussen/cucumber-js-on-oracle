//import { describe } from "mocha";
import "mocha";
import { expect } from "chai";
import { IEmployee, getEmployeeObject, getKeyIndexPos } from "../lib/class.HR"
const oracleJsonResponseObj = {
    metaData:
        [{ name: 'EMPLOYEE_ID' },
        { name: 'FIRST_NAME' },
        { name: 'LAST_NAME' },
        { name: 'EMAIL' },
        { name: 'PHONE_NUMBER' },
        { name: 'HIRE_DATE' },
        { name: 'JOB_ID' },
        { name: 'SALARY' },
        { name: 'COMMISSION_PCT' },
        { name: 'MANAGER_ID' },
        { name: 'DEPARTMENT_ID' }],
    rows:
        [[100,
            'Steven',
            'King',
            'SKING',
            '515.123.4567',
            '2003-06-16T23:00:00.000Z', // this as there without dates
            'AD_PRES',
            28800,
            null,
            null,
            90]]
}

// first we identify what items are on what numbers
// then we can access items by number



describe("HR Employee", () => {

    it('should return hello world', () => {
        const newArray = getKeyIndexPos(oracleJsonResponseObj.metaData);
        expect(oracleJsonResponseObj.metaData.length).to.equal(newArray.length);
        const someIndex = 5;
        expect(newArray[someIndex].index).to.equal(someIndex);
        expect(newArray[someIndex].name).to.equal(oracleJsonResponseObj.metaData[someIndex].name);
        //console.log(newArray);
        expect(1).to.eql(1);

    });

    it('should return create an object', () => {
        const empObj = getEmployeeObject(oracleJsonResponseObj.rows.pop(),oracleJsonResponseObj.metaData);
        expect(empObj.PHONE_NUMBER,"PhoneNumber must match").to.equal('515.123.4567');
        // const newArray = getKeyIndexPos(oracleJsonResponseObj.metaData);
        // expect(oracleJsonResponseObj.metaData.length).to.equal(newArray.length);
        // const someIndex = 5;
        // expect(newArray[someIndex].index).to.equal(someIndex);
        // expect(newArray[someIndex].name).to.equal(oracleJsonResponseObj.metaData[someIndex].name);
        // console.log(newArray);
        // expect(1).to.eql(1);

    });

});