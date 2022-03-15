"use strict";

var WetterheldClient = require('./lib/wetterheldClient').WetterheldClient;

console.log(process.env.WETTERHELD_URL);

const serverUrl = process.env.WETTERHELD_URL;
const laravelToken = process.env.WETTERHELD_LARAVEL_TOKEN;

module.exports.price = async (event) => {

  if(!serverUrl || !laravelToken){
    return {
      statusCode: 500,
      body: JSON.stringify(
        "Missing env vars",
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

  try {
    await client.all.selectProduct();
    await client.all.getWeatherSources();
    await client.all.determineStation();
    await client.all.findStation();
    var finalResponse = await client.all.orderPrice();

  }catch(e){
    return {
      statusCode: 500,
      body: JSON.stringify(
        "Wetterheld API Error: " + e.errorMessage,
        null,
        2
      ),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      finalResponse,
      null,
      2
    ),
  };
  
};
