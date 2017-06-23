#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const pkg = require('../../package.json');
program.version(pkg.version)
    .command('proto [options]', 'generate node.js source codes from proto files')
    .command('rpcs [options]', 'generate rpc server service stubs from proto files')
    .command('router [options]', 'generate koa router files from swagger spec files')
    .command('scaffold [options]', 'create a new scaffold project')
    .parse(process.argv);
//# sourceMappingURL=sasdn.js.map