module.exports = function (restClient) {
    var module = {};
    
    module.create = function (dates, hours) {
        return restClient.post('/order/product', categoryAttributes);
    }

    module.select = function (categoryId, categoryAttributes) {
        var endpointUrl = util.format('/categories/%d', categoryId);
        return restClient.put(endpointUrl, categoryAttributes);
    }

    return module;
}