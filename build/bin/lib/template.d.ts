/// <reference types="handlebars" />
export declare namespace TplEngine {
    function registerHelper(name: string, fn: Function, inverse?: boolean): void;
    function render(templateName: string, params: {
        [key: string]: any;
    }): string;
    function compile(templateName: string): HandlebarsTemplateDelegate;
}
