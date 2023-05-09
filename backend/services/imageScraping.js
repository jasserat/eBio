const axios = require('axios');

exports.scrapeImage = async (productName) => {
  const response = await axios.get(`${process.env.UNSPLASH_URL}=${productName}`, {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
    }
  });

  return response.data.results[0].urls.regular;
}