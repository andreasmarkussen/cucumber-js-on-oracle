//require('ts-node').register({ /* options */ })
const req = "  --require-module ts-node/register --require '**/world.js'  --require features/step_definitions/**/*.ts --require hooks/**/*.ts  --require reporters/**/*.ts  "
const req_src = "  --require 'src/**/*.ts'  "

const form_json = " --format json:reports/cucumber-report.json --format summary ";

module.exports = {

// Default Parameters .
  default: `--format-options '{"snippetInterface": "async-await"}'` + req + form_json // + req_src
}
/*
module.exports = {
    default: '--format-options \'{"snippetInterface": "async-await"}\''
  }
  */