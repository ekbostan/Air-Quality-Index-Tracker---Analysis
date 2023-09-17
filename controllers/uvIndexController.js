const axios = require('axios');
const moment = require('moment');
const HourlyUV = require('../models/hourlyUvSchema');
const { promisify } = require('util');

// Define getFromCache and storeInCache functions globally
const getFromCache = async (client, key) => {
    const cachedData = await promisify(client.get).bind(client)(key);
    return cachedData ? JSON.parse(cachedData) : null;
};

const storeInCache = (client, key, data) => {
    promisify(client.set).bind(client)(key, JSON.stringify(data), 'EX', 3600); // Expires after 1 hour
};

exports.fetchUVIndexHourlyByZip = async (req, res) => {
    const zipCode = req.params.zip;

    try {
        const cachedData = await getFromCache(req.redisClient, zipCode);
        if (cachedData) {
            return res.status(200).json({
                status: "success",
                data: cachedData,
                source: 'Redis cache'
            });
        }

        const dataFromMongo = await HourlyUV.findOne({ zip: zipCode });

        if (dataFromMongo) {
            storeInCache(req.redisClient, zipCode, dataFromMongo);
            return res.status(200).json({
                status: "success",
                data: dataFromMongo,
                source: 'MongoDB'
            });
        }

        const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/${zipCode}/JSON`;
        const response = await axios.get(apiUrl, { timeout: 1000000 });

        const transformedData = {
            zip: zipCode,
            city: response.data[0].CITY,
            state: response.data[0].STATE,
            data: response.data.map(item => ({
                order: item.ORDER,
                dateTime: new Date(moment(item.DATE_TIME, 'MMM/DD/YYYY hh A')),
                uvValue: item.UV_VALUE
            }))
        };

        const newHourlyUVData = new HourlyUV(transformedData);
        await newHourlyUVData.save();

        storeInCache(req.redisClient, zipCode, newHourlyUVData);

        return res.status(200).json({
            status: "success",
            data: newHourlyUVData,
            source: 'API'
        });
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            error: error.message
        });
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
}