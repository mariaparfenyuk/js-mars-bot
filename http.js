const axios = require("axios");
const https = require("https");

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  headers: {}
});

class HTTP {
  async get(url, axiosConfig) {
    try {
      const response = await instance.get(url, axiosConfig);
      return response;
    } catch (e) {
      return e;
    }
  };
};

module.exports = HTTP;
