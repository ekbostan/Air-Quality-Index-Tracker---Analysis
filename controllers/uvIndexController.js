const axios = require("axios");

exports.fetchUVIndexHourlyByZip = async (req, res) => {
  const zipCode = req.params.zip;

  try {
    const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/${zipCode}/JSON`;

    const response = await axios.get(apiUrl, { timeout: 10000 });

    res.status(200).json({
      status: "success",
      data: response.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data.");
  }
};

exports.fetchUVIndexHourlyByCityState = async (req, res) => {
  const city = req.params.city;
  const state = req.params.state; // Fixed the typo here

  try {
    const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/CITY/${city}/STATE/${state}/JSON`;

    const response = await axios.get(apiUrl, { timeout: 1000 });

    res.status(200).json({
      status: "success",
      data: response.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data.");
  }
};

exports.fetchDailyByZip = async (req, res) => {
  const zipCode = req.params.zip;

  try {
    // Define the API URL to fetch daily UV Index data
    const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVDAILYY/ZIP/${zipCode}/JSON`;

    // Make an HTTP GET request to the API
    const response = await axios.get(apiUrl, { timeout: 10000 });

    // Return the data in the response
    res.status(200).json({
      status: "success",
      data: response.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data.");
  }
};

exports.fetchDailyByCityState = async (req, res) => {
  const city = req.params.city;
  const state = req.params.state; // Fixed the typo here

  try {
    const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVDAILY/CITY/${city}/STATE/${state}/JSON`;

    const response = await axios.get(apiUrl, { timeout: 1000 });

    res.status(200).json({
      status: "success",
      data: response.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data.");
  }
};
