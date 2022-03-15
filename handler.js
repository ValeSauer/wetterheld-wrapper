"use strict";

var WetterheldClient = require('./lib/wetterheldClient').WetterheldClient;

const serverUrl = process.env.WETTERHELD_URL;
const laravelToken = process.env.WETTERHELD_LARAVEL_TOKEN;

module.exports.getPrice = async (event) => {

  if(!serverUrl || !laravelToken){
    return {
      statusCode: 500,
      body: JSON.stringify(
        "Missing environment variables",
        null,
        2
      ),
    };
  }
  
  const options = {
    serverUrl,
    laravelToken
  }
  var client = WetterheldClient(options);

  const querystring = event.queryStringParameters;
  if(!(querystring.dates) || !(querystring.hours)){
    return sendResponse(422, "No dates or hours given");
  }
  const dates = querystring.dates;
  const hours = querystring.hours;
  if(!(querystring.lat) || !(querystring.lng)){
    return sendResponse(422, "No lat/lng given");
  }
  const lat = querystring.lat;
  const lng = querystring.lng;
  if(!(querystring.street) || !(querystring.house) || !(querystring.zip) || !(querystring.city)){
    return sendResponse(422, "Incomplete address data given");
  }
  const city = querystring.city;
  const zip = querystring.zip;
  const street = querystring.street;
  const house = querystring.house;

  try {
    await client.all.selectProduct(dates, hours);
    await client.all.getWeatherSources();
    await client.all.determineStation();
    await client.all.findStation(lat, lng, city, zip, street, house);
    var finalResponse = await client.all.orderPrice();

  }catch(e){
    return sendResponse(500, "Wetterheld API Error: " + e.errorMessage)
  }

  return sendResponse(200, finalResponse);

  function sendResponse(responseCode = 500, responseBody = "Undefined error"){
    return {
      statusCode: responseCode,
      body: JSON.stringify(
        responseBody,
        null,
        2
      ),
    };
  }
  
  
};
