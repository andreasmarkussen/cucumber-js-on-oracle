//const { assembly } = require("./world");
import {ParentAssembly} from './assemblies/iassembly';
import {GenericEmployeeList} from '../../lib/databaseEmployeeList'
class EmployeeWorld {
  public static assembly:ParentAssembly;
  public currentEmployeeId:number;
  public currentEmployeeRow:any[];
  public contextEmployeeList:()=>Promise<GenericEmployeeList>;
  public actionEmployeeList: ()=>Promise<GenericEmployeeList>;
  public outcomeEmployeeList:()=>Promise<GenericEmployeeList>;
  constructor() {
//    if(assembly)
//    {
   /* this.context = {};
    this.action = {};
    this.outcome = {};*/
    this.contextEmployeeList = () => EmployeeWorld.assembly.contextEmployeeList();
    this.actionEmployeeList = () => EmployeeWorld.assembly.actionEmployeeList();
    this.outcomeEmployeeList = () => EmployeeWorld.assembly.outcomeEmployeeList();
    //   this.contextTodoList = () => assembly.contextTodoList()
    //   this.actionTodoList = () => assembly.actionTodoList()
    //   this.outcomeTodoList = () => assembly.outcomeTodoList()
    // }
    // else{
    //   throw new Error("Assembly is undefined");
      
    // }
}
  // attach(){
  //   //console.log("Attached called")
  // }
}
exports.EmployeeWorld = EmployeeWorld;