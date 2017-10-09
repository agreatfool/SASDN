"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi_1 = require("../utility/Joi");
class GatewayApiBase {
    register() {
        return [this.uri, this._validate(), this._execute()];
    }
    ;
    _validate() {
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            let aggregatedParams = this._parseParams(ctx);
            let joiSchemaMap = this._convertSchemaDefToJoiSchema(this.schemaDefObj);
            try {
                yield Joi_1.joiValidate(aggregatedParams, joiSchemaMap, { allowUnknown: true });
                yield next();
            }
            catch (e) {
                ctx.body = e.toString();
            }
        });
    }
    _execute() {
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            let aggregatedParams = this._parseParams(ctx);
            ctx.body = yield this.handle(ctx, next, aggregatedParams);
            yield next();
        });
    }
    _parseParams(ctx) {
        return Object.assign({}, ctx.params, ctx.query, { body: ctx.request.body }); // bodyParse required
    }
    _convertSchemaDefToJoiSchema(gatewayJoiSchemaMap) {
        let joiSchemaMap = {};
        for (let key in gatewayJoiSchemaMap) {
            let gatewayJoiSchema = gatewayJoiSchemaMap[key];
            let joiSchema = {};
            switch (gatewayJoiSchema.type) {
                case 'array':
                    joiSchema = (gatewayJoiSchema.required)
                        ? Joi_1.joi.array().required()
                        : Joi_1.joi.array().optional();
                    break;
                case 'boolean':
                    joiSchema = (gatewayJoiSchema.required)
                        ? Joi_1.joi.boolean().required()
                        : Joi_1.joi.boolean().optional();
                    break;
                case 'number':
                    joiSchema = (gatewayJoiSchema.required)
                        ? Joi_1.joi.number().required()
                        : Joi_1.joi.number().optional();
                    break;
                case 'object':
                    joiSchema = (gatewayJoiSchema.required)
                        ? Joi_1.joi.object(this._convertSchemaDefToJoiSchema(gatewayJoiSchema.schema)).required()
                        : Joi_1.joi.object(this._convertSchemaDefToJoiSchema(gatewayJoiSchema.schema)).optional();
                    break;
                case 'string':
                    joiSchema = (gatewayJoiSchema.required)
                        ? Joi_1.joi.string().required()
                        : Joi_1.joi.string().optional();
                    break;
                default:
                    joiSchema = (gatewayJoiSchema.required)
                        ? Joi_1.joi.any().required()
                        : Joi_1.joi.any().optional();
                    break;
            }
            joiSchemaMap[key] = joiSchema;
        }
        return joiSchemaMap;
    }
}
exports.GatewayApiBase = GatewayApiBase;
