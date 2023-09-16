const axios = require("axios");

exports.fetchUVIndexByZip = async (req, res) => {
  const zipCode = req.params.zip;
  
  try {
    const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/${zipCode}/JSON`;
    
    const response = await axios.get(apiUrl, { timeout: 10000 });

    res.status(200).json({
      status: 'success',
      data: response.data
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data.");
  }
};

exports.fetchUVIndexByCityAndState = async (req, res) => {
    const city = req.params.city;
    const state = req.params.state;  // Fixed the typo here

    try{
        const apiUrl = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/CITY/${city}/STATE/${state}/JSON`;

        const response = await axios.get(apiUrl, {timeout: 1000});
        
        res.status(200).json({
            status: 'success',
            data: response.data
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data.");
    }
};


exports.getDailyByZip = async (req, res) => {
  // ... Implement logic to fetch daily data by ZIP
};

exports.getDailyByCityState = async (req, res) => {
  // ... Implement logic to fetch daily data by city and state
};
