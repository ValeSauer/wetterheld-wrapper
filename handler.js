"use strict";

var WetterheldClient = require("./lib/wetterheldClient").WetterheldClient;

const serverUrl = process.env.WETTERHELD_URL;
const laravelToken = process.env.WETTERHELD_LARAVEL_TOKEN;

module.exports.getPrice = async (event) => {
  if (!serverUrl || !laravelToken) {
    return {
      statusCode: 500,
      body: JSON.stringify("Missing environment variables", null, 2),
    };
  }

  const options = {
    serverUrl,
    laravelToken,
  };
  var client = WetterheldClient(options);

  const querystring = event.queryStringParameters;
  if (!querystring) {
    return sendResponse(422, "No data given");
  }
  if (!querystring.dates || !querystring.hours) {
    return sendResponse(422, "No dates or hours given");
  }
  const dates = JSON.parse(querystring.dates);
  const hours = JSON.parse(querystring.hours);
  if (!Array.isArray(dates) || !Array.isArray(hours)) {
    return sendResponse(422, "No or invalid dates or hours given");
  }
  if (!querystring.lat || !querystring.lng) {
    return sendResponse(422, "No lat/lng given");
  }
  const lat = querystring.lat;
  const lng = querystring.lng;
  if (
    !querystring.street ||
    !querystring.house ||
    !querystring.zip ||
    !querystring.city
  ) {
    return sendResponse(422, "Incomplete address data given");
  }
  const city = querystring.city;
  const zip = querystring.zip;
  const street = querystring.street;
  const house = querystring.house;

  if (!querystring.amount) {
    return sendResponse(422, "No amount data given");
  }

  const amount = querystring.amount;

  var step = 0;

  try {
    step++;
    await client.all.selectProduct(dates, hours);
    step++;
    await client.all.determineStation();
    step++;
    const station = await client.all.findStation(lat, lng, city, zip, street, house);
    step++;
    const priceResponse = await client.all.orderPrice(amount);
    if (
      priceResponse &&
      priceResponse.price.insurers &&
      priceResponse.price.insurers[0] &&
      priceResponse.price.insurers[0].price
    ) {
      return sendResponse(200, 
        { price: priceResponse.price.insurers[0].price,
          threshold: priceResponse.threshold,
          station
        });
    } else {
      return sendResponse(500, "Invalid price response form Wetterheld");
    }
  } catch (e) {
    return sendResponse(500, "Wetterheld API Error on Step " + step + ": " + e.errorMessage);
  }

  function sendResponse(responseCode = 500, responseBody = "Undefined error") {
    return {
      statusCode: responseCode,
      body: JSON.stringify(responseBody, null, 2),
    };
  }
};
