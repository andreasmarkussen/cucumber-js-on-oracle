var oracledb = require('oracledb');
const connectString_XEDEB1 =  "localhost:1521/XEPDB1";
const connectString_XE =  "localhost:1521/XE";
const auth_info = {
  user : "system", // [username]
  password : "GetStarted18c", // [password]
  connectString : connectString_XEDEB1  // [hostname]:[port]/[DB service name]
};

const auth_info_hr = {
  user : "hr", // [username]
  password : "hr", // [password]
  connectString : connectString_XEDEB1  // [hostname]:[port]/[DB service name]
};

  async function run() {
      let connection = await oracledb.getConnection(auth_info_hr);
    let result = await connection.execute( "SELECT 'Hello World!' FROM dual");
    //console.log(result.rows[0]);
  }
 
  run();
