const axios = require('axios');
const apiKey = 'bluehare65';

// Fetch AQI by State
exports.fetchAQIByState = async (req, res) => {
  const state = req.params.state;

  try {
    const apiUrl = `https://aqs.epa.gov/data/api/dailyData/byState?email=erolkaanbostan2000@aqs.api&key=${apiKey}&param=44201&bdate=20220913&edate=20220913&cbdate=20180101&cedate=20181231&state=${state}`;
    const response = await axios.get(apiUrl, { timeout: 15000 });

    res.status(200).json({
      status: "success",
      data: response.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching AQI data.");
  }
};
