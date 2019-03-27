//import * as path from 'path'
//import * as fs from 'fs'
import * as OD from '../lib/OracleDatabaseDriver';
import * as TSG from '../lib/TypeScriptGenerator';
import ArgvParser from './argv_parser';
const od = OD.OracleDatabaseDriver.instance();

export default class Cli {
//  constructor(public argv, public cwd, public stdout ) {
   constructor(public input:{  argv:string[], cwd, stdout }) {
      // this.argv = argv
    // this.cwd = cwd
    // this.stdout = stdout
  }

  async generateCode(whereClause = `object_name like '%_JOB_%'`){
    const returnedProceduresMetaData = await od.proceduresMetadata(whereClause);
    console.log("Objects found",returnedProceduresMetaData);
    let tsgOracle = new TSG.OracleTypeScriptStrategy();
    let allGeneratedCode = tsgOracle.addProcedures(returnedProceduresMetaData);    

  }

  async run(){
    console.log("ArgV",this.input.argv);
    const { options } = ArgvParser.parse(this.input.argv);
    console.log("Options",options);
    let whereClause;
    //const typesOptions:any[] = options;
    if(options['where'] !== undefined){
      whereClause = options['where'];
      console.log("Where clause for procedures",whereClause)
    }
    await this.generateCode(whereClause);
    return {success:true}
};
};

// Inspiration from https://github.com/cucumber/cucumber-js/blob/master/src/cli/index.js
