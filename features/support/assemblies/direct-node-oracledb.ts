import { ParentAssembly } from './iassembly';
import { DatabaseEmployeeList, GenericEmployeeList } from '../../../lib/databaseEmployeeList';

class myClass implements ParentAssembly {
  public _databaseEmployeeList: DatabaseEmployeeList;
  constructor() {
    this._databaseEmployeeList = new DatabaseEmployeeList()

  };

  async start() {
    await this._databaseEmployeeList.start();
  };
  async stop() {

  };

  async contextEmployeeList(): Promise<GenericEmployeeList> {
    //console.log("Asking for _databaseEmployeeList",this._databaseEmployeeList)
    return this._databaseEmployeeList
  }

  async actionEmployeeList(): Promise<GenericEmployeeList> {
    return this._databaseEmployeeList
  }

  async outcomeEmployeeList(): Promise<GenericEmployeeList> {
    return this._databaseEmployeeList
  }
};

/**
 * const DatabaseEmployeeList = require('../../../lib/server/DatabaseEmployeeList')

module.exports = class DatabaseAssembly {
  async start () {
    this._databaseEmployeeList = new DatabaseEmployeeList()
    await this._databaseEmployeeList.start(true)
  }

  async stop() {}

  async contextEmployeeList():Promise<GenericEmployeeList>{
    return this._databaseEmployeeList
  }

  async actionEmployeeList():Promise<GenericEmployeeList>{
    return this._databaseEmployeeList
  }

  async outcomeEmployeeList():Promise<GenericEmployeeList>{
    return this._databaseEmployeeList
  }
}
 */

module.exports = myClass;