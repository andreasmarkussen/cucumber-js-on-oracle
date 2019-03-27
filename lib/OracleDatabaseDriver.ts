import * as OraDB from 'oracledb';
import { IPlsqlProcedure, IPlsqlArgument } from './OracleDbInterfaces';
import { OracleTypeScriptStrategy } from './TypeScriptGenerator';
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.ARRAY;
const db_config = require('../oracle.config.js');

export class OracleDatabaseDriver{
    public static shared_instance: OracleDatabaseDriver;
    public connection: OraDB.IConnection;
    public async start() {
        if(this.connection && this.connection.oracleServerVersion)
            return;
        if (db_config.module.authInfo === undefined) {
            console.error("DB CONFIG GIVEN", db_config);
            throw new Error("No Oracle Config information is available" + JSON.stringify(db_config));

        }
        this.connection = await oracledb.getConnection(db_config.module.authInfo);
    
     //   this.connection = await OraDB.getConnection()
        //TODO: Refactor so that we can use the TypeScript interface.. requires a typed input?? for authInfo
    }
    
    public static instance():OracleDatabaseDriver{
        if(OracleDatabaseDriver.shared_instance === undefined)
        {
            new OracleDatabaseDriver(); // It automatically gets set in the constuctor, so no need to set it again
        } 
        return OracleDatabaseDriver.shared_instance;
    }

    constructor(){
        if(OracleDatabaseDriver.shared_instance === undefined)
        {
            OracleDatabaseDriver.shared_instance = this;
        }
        this.start();
    }


    public async exec(sql:string):Promise<OraDB.IExecuteReturn>{
        await this.start();
        console.log("SQL:", sql);
        try {
            return await this.connection.execute(sql);
        } catch (error) {
            console.error("Error executing SQL: ", sql);
            console.log("Error code: ", error);
            throw error;
            return;
        }
    }

    /**
     * 
     * @param whereClause e.g. ='object_name = 'ADD_JOB_HISTORY''
     */
    public async proceduresMetadata(whereClause:string):Promise<IPlsqlProcedure[]>{
        const OBJECT_NAME:number = 0; // POSITION IN 
        let realWhereClause = '1=1';
        if(whereClause === undefined)
            realWhereClause = whereClause;
        const proceduresList = await this.exec(`select * from user_procedures where ${whereClause} and procedure_name is null` );
        if(proceduresList.rows !== undefined){
            let pl:IPlsqlProcedure[] =[];
            const ar:any[][] = proceduresList.rows;
            const newMap = await Promise.all(ar.map(
                    async (row)=> ({object_name:row[OBJECT_NAME], arguments: await this.procedureMetadata(row[OBJECT_NAME])})
                ));// ending ar.map() and Promise.all()
            return newMap;

        }
        return [];
    }

    public static plsqlDateFromJavaScriptDate(date:Date){
        return OracleTypeScriptStrategy.typeJavaScriptDateToOracleDate(date);
    }

    public async procedureMetadata(procedureName:string):Promise<IPlsqlArgument[]>{
        const ARGUMENT_NAME=0,DATA_TYPE=1;
        if(procedureName === undefined) throw new Error("procedureName must be defined");
        const argsList = await this.exec(`select ARGUMENT_NAME, DATA_TYPE from user_arguments where object_name = '${procedureName}'`)
        let Plsqlarg: IPlsqlArgument[] = [];
        let args:IPlsqlArgument[] = [];
        if(argsList){
            argsList.rows.forEach((row:any[]) => {
                Plsqlarg.push( {argument_name:row[ARGUMENT_NAME],data_type:row[DATA_TYPE]});
            });
        }
        return Plsqlarg;
    }
}

/** from https://stackoverflow.com/questions/8924428/native-method-to-pull-out-metadata-about-packages-procedures-and-functions
 * select     p.procedure_name
         , a.argument_name
         , a.data_type
         , a.defaulted
         , a.default_value
         , a.in_out
         , a.position
from       all_procedures p
inner join all_objects o
        on o.object_id = p.object_id
inner join all_arguments a
        on a.package_name = o.object_name
       and a.object_name = p.procedure_name
where      o.object_type = 'PACKAGE'
and        o.object_name = 'PACKAGE_NAME'
order by   p.procedure_name, a.position;
 */
