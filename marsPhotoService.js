"use strict"
const HTTP = require("./http");
const keys = require('./apiKey.json');

const url = 'https://api.nasa.gov/mars-photos/api/v1/rovers'
const nasaApiKey = keys.nasaApiKey;

class MarsPhotoService extends HTTP {
  constructor() {
    super();
    this.url = url;
    this.nasaApiKey = this.nasaApiKey;
  }

  async getMarsPhoto(rover, dateForPhoto, camera
    ) {
    const resposnse = await super.get(url + rover + `/photos?earth_date=${dateForPhoto}&camera=${camera}` + nasaApiKey, 
    { headers: {} });
    return resposnse;
  }
};

module.exports = MarsPhotoService;