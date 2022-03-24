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
    return restClient.post("product", body);
  };

  module.determineStation = function () {
    var body = {
      country_code_sale: "DE",
      weather_source_type: "station"
    };
    return restClient.post("product/determine", body);
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

  module.orderPrice = async function (amount) {

    var threshold = 2.0;

    var body = {
      daily_payout: parseFloat(amount),
      risk_days: 0,
      threshold
    };

    for (var i = 1; i <= 10; i++) {
      body.threshold = threshold + i;
      response = await fetchPriceStep(body);
      if(response){
        break;
      }
    }

    return {
      threshold: body.threshold, 
      price: response
    };
  };

  fetchPriceStep = async function(body){
    try {
      response = await restClient.post("order/price/", body);
    } catch (error) {
      response = false;
    }
    return response;
  }

  return module;
};
