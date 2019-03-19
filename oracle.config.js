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

exports.module = {
    connectString: connectString_XEDEB1,
    authInfo:auth_info_hr
};
