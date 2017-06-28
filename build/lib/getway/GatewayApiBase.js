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
const Utility_1 = require("../Utility");
class GatewayApiBase {
    register() {
        return [this.uri, this._validate(), this._execute()];
    }
    ;
    _validate() {
        let _this = this;
        return function (ctx, next) {
            return __awaiter(this, void 0, void 0, function* () {
                let aggregatedParams = _this._parseParams(ctx);
                let joiSchemas = _this._convertSchemaDefToJoiSchema(_this.schemaDefObj);
                try {
                    yield Utility_1.joiValidate(aggregatedParams, joiSchemas, { allowUnknown: true });
                    yield next();
                }
                catch (err) {
                    ctx.body = err.toString();
                }
            });
        };
    }
    _execute() {
        let _this = this;
        return function (ctx, next) {
            return __awaiter(this, void 0, void 0, function* () {
                let aggregatedParams = _this._parseParams(ctx);
                ctx.body = yield _this.handle(ctx, next, aggregatedParams);
                yield next();
            });
        };
    }
    _parseParams(ctx) {
        return Object.assign({}, ctx.params, ctx.query, { body: ctx.request.body }); // bodyParse required
    }
    _convertSchemaDefToJoiSchema(gatewaySchemas) {
        let schemaMap = {};
        for (let key in gatewaySchemas) {
            let gatewaySchema = gatewaySchemas[key];
            let joiSchema = {};
            switch (gatewaySchema.type) {
                case "array":
                    joiSchema = (gatewaySchema.required)
                        ? Utility_1.joi.array().required()
                        : Utility_1.joi.array().optional();
                    break;
                case "boolean":
                    joiSchema = (gatewaySchema.required)
                        ? Utility_1.joi.boolean().required()
                        : Utility_1.joi.boolean().optional();
                    break;
                case "number":
                    joiSchema = (gatewaySchema.required)
                        ? Utility_1.joi.number().required()
                        : Utility_1.joi.number().optional();
                    break;
                case "object":
                    joiSchema = (gatewaySchema.required)
                        ? Utility_1.joi.object(this._convertSchemaDefToJoiSchema(gatewaySchema.schema)).required()
                        : Utility_1.joi.object(this._convertSchemaDefToJoiSchema(gatewaySchema.schema)).optional();
                    break;
                case "string":
                    joiSchema = (gatewaySchema.required)
                        ? Utility_1.joi.string().required()
                        : Utility_1.joi.string().optional();
                    break;
                default:
                    joiSchema = (gatewaySchema.required)
                        ? Utility_1.joi.any().required()
                        : Utility_1.joi.any().optional();
                    break;
            }
            schemaMap[key] = joiSchema;
        }
        return schemaMap;
    }
}
exports.GatewayApiBase = GatewayApiBase;
//# sourceMappingURL=GatewayApiBase.js.map