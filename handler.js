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
  if(!(querystring)){
    return sendResponse(422, "No data given");
  }
  if(!(querystring.dates) || !(querystring.hours)){
    return sendResponse(422, "No dates or hours given");
  }
  const dates = JSON.parse(querystring.dates);
  const hours = JSON.parse(querystring.hours);
  if(!(Array.isArray(dates)) || !(Array.isArray(hours))){
    return sendResponse(422, "No or invalid dates or hours given");
  }
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
    const priceResponse = await client.all.orderPrice();
    if(priceResponse && priceResponse.insurers && priceResponse.insurers[0] && priceResponse.insurers[0].price){
      return sendResponse(200, {price: priceResponse.insurers[0].price});
    }else{
      return sendResponse(500, "Invalid price response form Wetterheld");
    }

  }catch(e){
    return sendResponse(500, "Wetterheld API Error: " + e.errorMessage)
  }



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
