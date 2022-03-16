module.exports = function (restClient) {
  var module = {};

  module.selectProduct = function (dates, hours) {
    var body = {
      business: {
        type: "event",
      },
      dates: dates,
      hours: hours,
      partner_code: "wetterheld",
    };
    return restClient.post("order/product", body);
  };

  module.getWeatherSources = function () {
    var body = {};
    return restClient.get("product/source_types/DE", body);
  };

  module.determineStation = function () {
    var body = {};
    return restClient.get("product/determine/station", body);
  };

  module.findStation = function (lat, lng, city, zip, street, house) {
    var body = {
      location: {
        latitude: lat,
        longitude: lng,
        address: `${street} ${house}, ${zip} ${city}, Germany`,
        city: city,
        country: "DE",
        zip: zip,
        street: street,
        house: house,
        place_id: "ChIJ0T0c7k5NqEcRNHa1yeDWGoE",
        input_type: "text",
      },
    };
    return restClient.post("station/find", body);
  };

  module.orderPrice = function (amount) {
    var body = {
      daily_payout: amount,
      risk_days: 0,
      weather_severity: "high",
    };
    return restClient.post("order/price/", body);
  };

  return module;
};
