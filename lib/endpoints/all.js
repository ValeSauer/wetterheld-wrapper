module.exports = function (restClient) {
    var module = {};
    
    module.selectProduct = function (dates, hours) {
        var body = {
            "business": {
                "type": "event"
            },
            "dates": [
                "2022-06-28",
                "2022-06-29",
                "2022-06-30"
            ],
            "hours": [10,11,12,13,14,15,16,17],
            "partner_code": "wetterheld"
        }
        return restClient.post('order/product', body);
    }

    module.getWeatherSources = function () {
        var body = {}
        return restClient.get('product/source_types/DE', body);
    }

    module.determineStation = function () {
        var body = {}
        return restClient.get('product/determine/station', body);
    }

    module.findStation = function () {
        var body = {
            "location": {
                "latitude": 52.6149208,
                "longitude": 13.4737034,
                "address": "Frundsbergstraße 4, 13125 Berlin, Germany",
                "city": "Berlin",
                "country": "DE",
                "zip": "13125",
                "street": "Frundsbergstraße",
                "house": "4",
                "place_id": "ChIJ0T0c7k5NqEcRNHa1yeDWGoE",
                "input_type": "text"
            }
        }
        return restClient.post('station/find', body);
    }

    module.orderPrice = function () {
        var body = {
            "daily_payout": 2000,
            "risk_days": 0,
            "weather_severity": "high"
        }
        return restClient.post('order/price/', body);
    }


    return module;
}