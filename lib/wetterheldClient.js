'use strict';

var RestClient = require('./rest_client').RestClient;
var all = require('./endpoints/all');

module.exports.WetterheldClient = function (options) {
    var instance = {
        addMethods (key, module) {
            var client = RestClient(options);
            if (module) {
                if (this[key])
                    this[key] = Object.assign(this[key], module(client))
                else 
                    this[key] = module(client)
            }
        }
    };

    var client = RestClient(options);

    instance.all = all(client);

    return instance;
}