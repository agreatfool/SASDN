import * as handlebars from "handlebars";
import * as prompt from "prompt";

const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI');

console.log('scaffold entered');

prompt.start();

//
// Get two properties from the user: username and email
//
prompt.get(['username', 'email'], function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  username: ' + result.username);
    console.log('  email: ' + result.email);
});