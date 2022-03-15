'use strict';

var axios = require('axios');

module.exports.Client = function (options) {
    var instance = {};

    var serverUrl = options.url;
    var token = options.token;

    function apiCall(request_data, request_token = '', customHeaders = {}) {
        /* eslint no-undef: off*/        
        return new Promise(function (resolve, reject) {
            request({
                url: request_data.url,
                method: request_data.method,
                headers: {
                    Token: request_token,
                    ...customHeaders
                },
                json: true,
                body: request_data.body,
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                    return;
                } else if (!httpCallSucceeded(response)) {
                    var errorMessage = 'HTTP ERROR ' + response.code;
                    if(body && body.hasOwnProperty('message') )
                        errorMessage = errorString(body.message, body.hasOwnProperty('parameters') ? body.parameters : {});
                    
                    reject({
                        errorMessage,
                        code: response.statusCode,
                        toString: () => {
                            return this.errorMessage
                        }
                    });
                }
                resolve(body);
            });
        });
    }

    function httpCallSucceeded(response) {
        return response.statusCode >= 200 && response.statusCode < 300;
    }

    function errorString(message, parameters) {
        if (parameters === null) {
            return message;
        }
        if (parameters instanceof Array) {
            for (var i = 0; i < parameters.length; i++) {
                var parameterPlaceholder = '%' + (i + 1).toString();
                message = message.replace(parameterPlaceholder, parameters[i]);
            }
        } else if (parameters instanceof Object) {
            for (var key in parameters) {
                var parameterPlaceholder = '%' + key;
                message = message.replace(parameterPlaceholder, parameters[key]);
            }
        }

        return message;
    }

    instance.get = function (resourceUrl, request_token = '') {
        var request_data = {
            url: createUrl(resourceUrl),
            method: 'GET'
        };
        return apiCall(request_data, request_token);
    }

    function createUrl(resourceUrl) {
        return servelrUrl + '/' + apiVersion + resourceUrl;
    }

    instance.post = function (resourceUrl, data, request_token = '', customHeaders = {}) {
        var request_data = {
            url: createUrl(resourceUrl),
            method: 'POST',
            body: data
        };
        return apiCall(request_data, request_token, customHeaders);
    }

    instance.put = function (resourceUrl, data, request_token = '') {
        var request_data = {
            url: createUrl(resourceUrl),
            method: 'PUT',
            body: data
        };
        return apiCall(request_data, request_token);
    }

    instance.delete = function (resourceUrl, request_token = '') {
        var request_data = {
            url: createUrl(resourceUrl),
            method: 'DELETE'
        };
        return apiCall(request_data, request_token);
    }

    return instance;
}