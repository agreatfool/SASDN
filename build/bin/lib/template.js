"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LibFs = require("fs");
const LibPath = require("path");
const handlebars = require("handlebars");
const helpers = require("handlebars-helpers");
helpers({ handlebars: handlebars });
handlebars.registerHelper('curlyLeft', () => '{');
handlebars.registerHelper('curlyRight', () => '}');
handlebars.registerHelper('setVar', (varName, varValue, options) => {
    options.data.root[varName] = varValue;
    return;
});
handlebars.registerHelper('uppercaseAndReplaceUnderline', (v) => {
    return v.replace(/(^.)|(?:_(.))/g, (v1, v2, v3) => (v2 || v3).toUpperCase());
});
handlebars.registerHelper('lowercaseFirst', (v) => {
    return v.replace(/(^.)/, (v) => v.toLowerCase());
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
