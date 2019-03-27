import { Command } from 'commander';
const {version} = require('../package.json');
import * as path from 'path';

export default class ArgvParser {
    static parse(argv:string[]) {
        const program = new Command(path.basename(argv[1]))

        program
            .version(version, '-v, --version')
            .option(
                '--where <whereClause>',
                "Used to select procedures e.g. 'object_name like ''%ADD_JOB%'' ' ",
                ''
            );

        program.parse(argv)

        return {
            options: program.opts(),
            args: program.args,
        }
    }
}