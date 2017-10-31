import * as LibFs from 'fs';
import * as LibPath from 'path';
import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';

helpers({handlebars: handlebars});
handlebars.registerHelper('curlyLeft', function () {
    return '{';
});
handlebars.registerHelper('curlyRight', function () {
    return '}';
});
handlebars.registerHelper('equal', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
handlebars.registerHelper('hump', function (str, type) {
    let name = '';
    let tmp = str.split('_');
    for (let i = 0; i < tmp.length; i++) {
        if (i > 0 || type == 'ucfirst') {
            name += tmp[i].charAt(0).toUpperCase() + tmp[i].slice(1);
        } else {
            name += tmp[i];
        }
    }
    return name;
});

const TPL_BASE_PATH = LibPath.join(__dirname, '..', 'template');

export namespace TplEngine {

    export function registerHelper(name: string, fn: Function, inverse?: boolean): void {
        handlebars.registerHelper(name, fn, inverse);
    }

    export function render(templateName: string, params: {[key: string]: any}): string {
        return compile(templateName)(params);
    }

    export function compile(templateName: string): HandlebarsTemplateDelegate {
        return handlebars.compile(
            LibFs.readFileSync(`${LibPath.join(TPL_BASE_PATH, templateName)}.hbs`).toString()
        );
    }

}