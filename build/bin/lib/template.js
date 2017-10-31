"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LibFs = require("fs");
const LibPath = require("path");
const handlebars = require("handlebars");
const helpers = require("handlebars-helpers");
helpers({ handlebars: handlebars });
handlebars.registerHelper('curlyLeft', function () {
    return '{';
});
handlebars.registerHelper('curlyRight', function () {
    return '}';
});
handlebars.registerHelper('equal', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
});
handlebars.registerHelper('hump', function (str, type) {
    let name = '';
    let tmp = str.split('_');
    for (let i = 0; i < tmp.length; i++) {
        if (i > 0 || type == 'ucfirst') {
            name += tmp[i].charAt(0).toUpperCase() + tmp[i].slice(1);
        }
        else {
            name += tmp[i];
        }
    }
    return name;
});
const TPL_BASE_PATH = LibPath.join(__dirname, '..', 'template');
var TplEngine;
(function (TplEngine) {
    function registerHelper(name, fn, inverse) {
        handlebars.registerHelper(name, fn, inverse);
    }
    TplEngine.registerHelper = registerHelper;
    function render(templateName, params) {
        return compile(templateName)(params);
    }
    TplEngine.render = render;
    function compile(templateName) {
        return handlebars.compile(LibFs.readFileSync(`${LibPath.join(TPL_BASE_PATH, templateName)}.hbs`).toString());
    }
    TplEngine.compile = compile;
})(TplEngine = exports.TplEngine || (exports.TplEngine = {}));
//# sourceMappingURL=template.js.map