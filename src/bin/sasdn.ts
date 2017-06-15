import * as program from "commander";

const pkg = require('../../package.json');

program.version(pkg.version)
    .command('proto [options]', 'generate node.js source codes from proto files')
    .command('rpcs [options]', 'generate rpc server service stubs from proto files')
    .command('scaffold [options]', 'create a new scaffold project')
    .parse(process.argv);