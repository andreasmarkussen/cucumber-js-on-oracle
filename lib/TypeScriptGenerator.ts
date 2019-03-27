import { IPlsqlProcedure, IPlsqlArgument } from './OracleDbInterfaces';
import { TypeScriptFile } from "./TypeScriptFile";

/**
 * 
 */
export class OracleTypeScriptStrategy {
    constructor(public outputPath = './lib/generated/') { };

    private getOracleFileStart() {
        const start = "import * as OraDB from 'oracledb';"
            + "\nimport * as ODAO from '../OracleDatabaseDriver';"
            + "\nconst oracledb = require('oracledb');"
            + "\nconst formatDate = ODAO.OracleDatabaseDriver.plsqlDateFromJavaScriptDate;"
        return start;
    }

    public static typeSwitchOracleToJavaScript(oracleType: string): string {
        switch (oracleType) {
            case 'NUMBER': return 'number';
            case 'DATE': return 'Date';
            case 'VARCHAR2': return 'string';
            default: throw new Error(`Unknown type '${oracleType}' `);
        }
    }

    public static typeSwitchJavaScriptToOracle(element: any, type: string) {
        switch (type) {
            case 'Number': return element;
            case 'String': return `'${element}'`;
            case 'Date': return OracleTypeScriptStrategy.typeJavaScriptDateToOracleDate(element);
            default: return "unknown type" + element.type;
        }
    }

    public static typeJavaScriptDateToOracleDate(javaScriptDate: any) {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        let current_dateTime = new Date(javaScriptDate)
        let formatted_date = current_dateTime.getDate() + "-" + months[current_dateTime.getMonth()] + "-" + current_dateTime.getFullYear()
        return `to_date('${formatted_date}','DD-MON-YYYY')`;
    }

    public static generatePlSqlCallBlock(procedureName, argumentList): string {
        const block_body = `${procedureName}(${argumentList})`;
        const basic_block = `DECLARE \n BEGIN \n ${block_body};\n END; \n`;
        return basic_block;
    }

    public static generateCallPlSqlCallBlock(procedureName, argumentList): string {
        const block_body = `${procedureName}(${argumentList})`;
        const plsqlBasicBlock = `
            DECLARE 
            BEGIN 
                ${block_body};
            END;
            `;
        const indent = (code: string) => " " + code;
        const nl = (code: string) => "\n" + code;
        const oracleCall = `  const o = ODAO.OracleDatabaseDriver.instance();
  let result = await o.exec(\`${plsqlBasicBlock}\`);`
        return oracleCall;
    }

    public static formatArgumentStringForTemplates(argumentsArray:Array<IPlsqlArgument>){
        //const templateArguments = argumentNames.map( argumentName => '${' + `${argumentName}`+ '}');
        let templateArguments = argumentsArray.map(argument =>  '${' + `${argument.argument_name}`+ '}'  );
        templateArguments = argumentsArray.map(argument => {
            let arg_name:string;
            switch(argument.data_type){
                case 'VARCHAR2': return "'${" + argument.argument_name + "}'"; 
                case 'NUMBER':   return  "${" + argument.argument_name + "}";
                case 'DATE':     return "${formatDate("+argument.argument_name+")}";
                default: throw new Error("Unknown data type: "+argument.data_type);
            };
        } );
        return templateArguments.join(', ');
    }

    /** Formats argument strings for Oracle PLSQL Calls from array of TypeScript types */
    public static formatArgumentString(args: any[], types: string[]) {
        const sep = ',\n       ';
        let count = 0;
        const new_ar = args.map((element) => OracleTypeScriptStrategy.typeSwitchJavaScriptToOracle(element, types[count++]));
        return new_ar.join(sep);
    }


    /** This method is only for procedures that does not belong to a package. */
    addProcedures(procedureMetaDataList: Array<IPlsqlProcedure>): string[] {
        let body = "return true;";
        let code = "";
        let allCode: string[] = [];
        procedureMetaDataList.forEach(procedureMetaData => {
            const typeScriptFile = new TypeScriptFile(this.outputPath, procedureMetaData.object_name);
            typeScriptFile.addLine(this.getOracleFileStart());
            const tsArgList: Array<any> = procedureMetaData.arguments.map(arg =>
                ({ name: arg.argument_name, typeScriptType: OracleTypeScriptStrategy.typeSwitchOracleToJavaScript(arg.data_type) }));
            const formatedArgList = OracleTypeScriptStrategy.formatArgumentStringForTemplates(procedureMetaData.arguments);
            body = OracleTypeScriptStrategy.generateCallPlSqlCallBlock(procedureMetaData.object_name, formatedArgList);
            code += TypeScriptGeneratorStrategy.createProcedureWithArguments(procedureMetaData.object_name, tsArgList, body);
            typeScriptFile.addLine(code);
            typeScriptFile.save();
            allCode.push(code);
        });
        return allCode;

    }
};

export class TypeScriptGeneratorStrategy {
    public static createProcedureWithArguments(procedureName, argumentsArray: { name: string, typeScriptType: string }[], body) {
        const argumentsDeclaration = argumentsArray.map(arg => `${arg.name}: ${arg.typeScriptType}`).join(",\n    ");
        return `export async function _call_${procedureName}(${argumentsDeclaration}){\n${body}\n}`;
    }

};
