const { EmployeeWorld } = require("./EmployeeWorld");

const { setWorldConstructor, Before, After } = require('cucumber')

const defaultAssemblyName = 'direct-node-oracledb';// Was 'memory';
const assemblyName = process.env.CUCUMBER_ASSEMBLY || defaultAssemblyName;

console.log(`🥒 ${assemblyName}`)

const AssemblyModule = require(`./assemblies/${assemblyName}`)
const assembly = new AssemblyModule();
EmployeeWorld.assembly = assembly;
//exports.assembly = assembly;


setWorldConstructor(EmployeeWorld)

Before(async function() {
  await assembly.start();
})

After(async function() {
  await assembly.stop();
})
