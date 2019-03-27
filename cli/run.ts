import Cli from './'
import VError from 'verror'

function exitWithError(error) {
    console.error("Exit and error",error) // eslint-disable-line no-console
    console.error(VError.fullStack(error)) // eslint-disable-line no-console
  process.exit(1)
}

export default async function run() {
  const cwd = process.cwd()
  const cli = new Cli({
    argv: process.argv,
    cwd,
    stdout: process.stdout,
  })

  let result
  try {
    result = await cli.run();
    console.log("Result was",result);
  } catch (error) {
    exitWithError(error)
  }

  const exitCode = result.success ? 0 : 1
  if (result.shouldExitImmediately) {
    process.exit(exitCode)
  } else {
    process.exitCode = exitCode
  }
}