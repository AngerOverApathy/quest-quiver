const axios = require('axios'); // Import Axios
const Equipment = require('../models/equipmentSchema');

const equipmentController = {
  
  // Fetch data from multiple endpoints based on name
  async fetchByName(req, res) {
    const { name } = req.query; // Get the 'name' query parameter from the request URL
    const baseUrl = 'https://www.dnd5eapi.co/api';
    const searchEndpoints = [
      `${baseUrl}/equipment?name=${name}`,
      `${baseUrl}/magic-items?name=${name}`,
      `${baseUrl}/weapon-properties?name=${name}`
    ];

    try {
      // Make search requests to all endpoints
      const searchRequests = searchEndpoints.map(endpoint => {
        console.log(`Making request to: ${endpoint}`); // Log the request URL
        return axios.get(endpoint);
      });
      const searchResponses = await Promise.allSettled(searchRequests);

      // Log the responses for debugging
      searchResponses.forEach((response, index) => {
        if (response.status === 'fulfilled') {
          console.log(`Response from ${searchEndpoints[index]}:`, response.value.data);
        } else {
          console.error(`Error from ${searchEndpoints[index]}:`, response.reason);
        }
      });

      // Extract results from successful search responses
      const searchResults = searchResponses
        .filter(response => response.status === 'fulfilled')
        .flatMap(response => response.value.data.results); // Use flatMap to directly get results

      console.log('Search Results:', searchResults); // Debug: Log search results

      if (searchResults.length > 0) {
        // Make detailed requests for each item found
        const detailRequests = searchResults.map(item => axios.get(`${baseUrl}${item.url}`));
        const detailResponses = await Promise.allSettled(detailRequests);

        // Extract detailed information from successful detail responses
        const detailedResults = detailResponses
          .filter(response => response.status === 'fulfilled')
          .map(response => response.value.data);

        console.log('Detailed Results:', detailedResults); // Debug: Log detailed results

        res.status(200).json({ results: detailedResults });
      } else {
        res.status(404).json({ message: 'No items found' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Failed to fetch data', error: error.message });
    }
  },
  
  // Other methods remain unchanged...
};

module.exports = equipmentController;
