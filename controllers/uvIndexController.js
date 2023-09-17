const axios = require("axios");
const moment = require("moment");
const hourlyUVZip = require("../models/hourlyUvSchemaZip");
const hourlyUVState = require("../models/hourlyUVState");
const dailyUVZip = require("../models/dailyUvSchemaZip");
const dailyUVState = require("../models/dailyUVState");

exports.fetchUVIndexHourlyByZip = async (req, res) => {
  const zipCode = req.params.zip;

  try {
    const dataFromMongo = await hourlyUVZip.findOne({ zip: zipCode });

    if (dataFromMongo) {
      return res.status(200).json({
        status: "success",
        data: dataFromMongo,
        source: "MongoDB",
      });
    }

    const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/${zipCode}/JSON`;
    const response = await axios.get(apiUrl, { timeout: 1000000 });

    const transformedData = {
      zip: zipCode,
      city: response.data[0].CITY,
      state: response.data[0].STATE,
      data: response.data.map((item) => ({
        order: item.ORDER,
        dateTime: new Date(moment(item.DATE_TIME, "MMM/DD/YYYY hh A")),
        uvValue: item.UV_VALUE,
      })),
    };

    const newHourlyUVData = new hourlyUVZip(transformedData);
    await newHourlyUVData.save();

    return res.status(200).json({
      status: "success",
      data: newHourlyUVData,
      source: "API",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};
exports.fetchUVIndexHourlyByCityState = async (req, res) => {
  const city = req.params.city;
  const state = req.params.state;
  const cityNormalized = city.trim().toUpperCase();
  const stateNormalized = state.trim().toUpperCase();

  try {
    const dataFromMongo = await hourlyUVState.findOne({
      city: cityNormalized,
      state: stateNormalized,
    });

    if (dataFromMongo) {
      return res.status(200).json({
        status: "success",
        data: dataFromMongo,
        source: "MongoDB",
      });
    } else {
      const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/CITY/${city}/STATE/${state}/JSON`;
      const response = await axios.get(apiUrl, { timeout: 1000000 });

      const transformedData = {
        city: response.data[0].CITY,
        state: response.data[0].STATE,
        data: response.data.map((item) => ({
          order: item.ORDER,
          dateTime: new Date(moment(item.DATE_TIME, "MMM/DD/YYYY hh A")),
          uvValue: item.UV_VALUE,
        })),
      };

      const upsertedHourlyUVData = await hourlyUVState.findOneAndUpdate(
        { city: transformedData.city, state: transformedData.state }, // filter
        transformedData, // update document
        { upsert: true, new: true, setDefaultsOnInsert: true } // options
      );

      return res.status(200).json({
        status: "success",
        data: upsertedHourlyUVData,
        source: "API",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.fetchDailyByZip = async (req, res) => {
  const zipCode = req.params.zip;

  try {
    const dataFromMongo = await dailyUVZip.findOne({ zipCode });

    if (dataFromMongo) {
      return res.status(200).json({
        status: "success",
        data: dataFromMongo,
        source: "MongoDB",
      });
    }

    const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVDAILY/ZIP/${zipCode}/JSON`;
    const response = await axios.get(apiUrl, { timeout: 1000000 });

    // Assuming the API returns a single entry for each ZIP code.
    const apiData = response.data[0];

    const transformedData = {
      zipCode: apiData.ZIP_CODE,
      city: apiData.CITY,
      state: apiData.STATE,
      uvIndex: Number(apiData.UV_INDEX), // Convert to number
      uvAlert: Number(apiData.UV_ALERT), // Convert to number
      date: new Date(moment(apiData.DATE, "MMM/DD/YYYY")) // Convert string to Date
    };

    const newDailyUVData = new dailyUVZip(transformedData);
    await newDailyUVData.save();

    return res.status(200).json({
      status: "success",
      data: newDailyUVData,
      source: "API",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.fetchDailyByCityState = async (req, res) => {
  const city = req.params.city;
  const state = req.params.state; 

  try {
    // Check MongoDB first
    const dataFromMongo = await dailyUVState.findOne({
      city: city.toUpperCase(),
      state: state.toUpperCase(),
    });

    if (dataFromMongo) {
      return res.status(200).json({
        status: "success",
        data: dataFromMongo,
        source: "MongoDB",
      });
    }

    // If not in MongoDB, fetch from the API
    const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVDAILY/CITY/${city}/STATE/${state}/JSON`;

    const response = await axios.get(apiUrl, { timeout: 1000 });

    if (response.data && response.data.length > 0) {
      const transformedData = {
        city: response.data[0].CITY,
        state: response.data[0].STATE,
        data: {
          uvIndex: Number(response.data[0].UV_INDEX),
          uvAlert: Number(response.data[0].UV_ALERT),
          date: new Date(moment(response.data[0].DATE, "MMM/DD/YYYY")),
        },
      };

      const upsertedData = await dailyUVState.findOneAndUpdate(
        { city: transformedData.city, state: transformedData.state },
        transformedData,
        { upsert: true, new: true }
      );

      return res.status(200).json({
        status: "success",
        data: upsertedData,
        source: "API",
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Data not found",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      error: err.message,
    });
  }
};