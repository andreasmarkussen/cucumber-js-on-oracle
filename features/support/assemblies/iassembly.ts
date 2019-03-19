import {GenericEmployeeList} from '../../../lib/databaseEmployeeList'
export interface ParentAssembly{
    contextEmployeeList:()=>Promise<GenericEmployeeList>;
    actionEmployeeList: ()=>Promise<GenericEmployeeList>;
    outcomeEmployeeList:()=>Promise<GenericEmployeeList>;
    start:()=>void;
    stop:()=>void;
}