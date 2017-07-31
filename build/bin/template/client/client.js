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
class SasdnAPI {
    constructor() {
        this._domain = 'localhost:3000/mock';
    }
    _ajax(options) {
        options = options || {};
        options.type = (options.type || 'GET').toUpperCase();
        options.dataType = (options.dataType || 'json').toLowerCase();
        let params = this._buildParam(options.data);
        let url = ((options.type == 'GET' || options.type == 'DELETE') && params !== null) ? options.url + '?' + params : options.url;
        return new Promise((resolve, reject) => {
            const xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            switch (options.type) {
                case 'POST':
                case 'PUT':
                case 'PATCH':
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    break;
            }
            xhr.open(options.type, url, true);
            xhr.send(params);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    return;
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    let response = xhr.responseText;
                    switch (options.dataType) {
                        case 'json':
                            response = JSON.parse(xhr.responseText);
                            break;
                        case 'xml':
                            response = xhr.responseXML;
                            break;
                    }
                    resolve({ response: response, statusText: xhr.statusText, statusCode: xhr.status });
                }
                else {
                    reject(xhr.responseText);
                }
            };
        });
    }
    _buildParam(condition) {
        let data = null;
        if (condition != null) {
            switch (typeof condition) {
                case 'string':
                    data = condition;
                    break;
                case 'object':
                    let arr = [];
                    for (let key in condition) {
                        let value = condition[key];
                        arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                    }
                    data = arr.join('&');
                    break;
            }
        }
        return data;
    }
    _handleParams(uri, params, aggParams, requiredParams) {
        let data = {};
        // fill aggParams && requiredParams via uri query params
        let requiredQueryParams;
        requiredQueryParams = uri.split(':');
        requiredQueryParams.shift();
        requiredQueryParams.forEach((key) => {
            if (aggParams.indexOf(key) < 0) {
                aggParams.push(key);
            }
            if (requiredParams.indexOf(key) < 0) {
                requiredParams.push(key);
            }
        });
        // validate requiredParams
        aggParams.forEach((key, index) => {
            const value = params[index];
            if (requiredParams.indexOf(key) >= 0 && (value === undefined || value === null || value === '')) {
                throw new Error('Param ' + key + ' is required!');
            }
            else if (value === undefined) {
                return;
            }
            if (uri.match(':' + key) !== null) {
                uri = uri.replace(':' + key, value);
            }
            else {
                data[key] = value;
            }
        });
        return { uri: uri, data: data };
    }
    _request(params, uri, method, aggParams, requiredParams) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = this._handleParams(uri, params, aggParams, requiredParams);
                if (params.length == 2 && typeof params[1] === 'object') {
                    data.data = params[1];
                }
                const response = yield this._ajax({
                    url: `${this._domain}${data.uri}`,
                    type: method,
                    timeout: 5000,
                    data: data.data
                });
                resolve(response);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    getTagInfo(offset, limit) {
        return __awaiter(this, arguments, void 0, function* () {
            const uri = '/getTagInfo/:offset/:limit';
            const method = 'GET';
            const aggParams = ['offset', 'limit'];
            const requiredParams = ['offset', 'limit'];
            return yield this._request(arguments, uri, method, aggParams, requiredParams);
        });
    }
}
exports.default = new SasdnAPI();
//# sourceMappingURL=client.js.map