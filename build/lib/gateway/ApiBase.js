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
        return [this.uri, this._validate(), this._mock(), this._execute()];
    }
    ;
    _validate() {
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            let aggregatedParams = this._parseParams(ctx);
            try {
                yield Joi_1.joiValidate(aggregatedParams, this.schemaDefObj, { allowUnknown: true });
                yield next();
            }
            catch (e) {
                const error = e;
                const validationDetail = error.details ? `: ${error.details[0].message}` : '';
                const errorObject = {
                    code: 1001001,
                    message: 'Invalid Params' + validationDetail
                };
                ctx.body = JSON.stringify(errorObject);
            }
        });
    }
    _mock() {
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            let aggregatedParams = this._parseParams(ctx);
            if (process.env.NODE_ENV == 'development' && aggregatedParams.hasOwnProperty('mock') && aggregatedParams['mock'] == 1) {
                ctx.body = yield this.handleMock(ctx, next, aggregatedParams);
            }
            else {
                yield next();
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
}
exports.GatewayApiBase = GatewayApiBase;
//# sourceMappingURL=ApiBase.js.map