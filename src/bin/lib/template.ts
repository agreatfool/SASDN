import * as LibFs from 'fs';
import * as LibPath from 'path';
import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';

helpers({ handlebars: handlebars });
handlebars.registerHelper('curlyLeft', () => '{');
handlebars.registerHelper('curlyRight', () => '}');

handlebars.registerHelper('ifCond', function (v1: string, operator: string, v2: string, options: any): any {
  switch (operator) {
    case '==':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

handlebars.registerHelper('setVar', (varName: string, varValue: string, options): void => {
  options.data.root[varName] = varValue;
  return;
});

handlebars.registerHelper('capitalize', (v: string): string => {
  return v.replace(/(^.)|(?:_(.))/g, (v1, v2, v3) => (v2 || v3).toUpperCase());
});

handlebars.registerHelper('lowercase', (v: string): string => {
  return v.replace(/(^.)/g, v => v.toLowerCase());
});

const TPL_BASE_PATH = LibPath.join(__dirname, '..', 'template');

export namespace TplEngine {

  export function registerHelper(name: string, fn: Function, inverse?: boolean): void {
    handlebars.registerHelper(name, fn, inverse);
  }

  export function render(templateName: string, params: { [key: string]: any }): string {
    return compile(templateName)(params);
  }

  export function compile(templateName: string): HandlebarsTemplateDelegate {
    return handlebars.compile(
      LibFs.readFileSync(`${LibPath.join(TPL_BASE_PATH, templateName)}.hbs`).toString(),
    );
  }

}
