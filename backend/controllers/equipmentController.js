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

  // Fetch data from an external API by index
  async fetchData(req, res) {
    const { index } = req.params; // Get index from the route parameters
    const baseUrl = 'https://www.dnd5eapi.co/api';
    const endpoints = [
      `${baseUrl}/equipment/${index}`,
      `${baseUrl}/magic-items/${index}`,
      `${baseUrl}/weapon-properties/${index}`
    ];

    try {
      const apiRequests = endpoints.map(endpoint => axios.get(endpoint));
      const apiResponses = await Promise.allSettled(apiRequests);

      const successfulResponse = apiResponses.find(response => response.status === 'fulfilled');

      if (successfulResponse) {
        res.status(200).json(successfulResponse.value.data);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Failed to fetch data', error: error.message });
    }
  },
  
  // Create a new equipment item
  async createEquipment(req, res) {
    try {
      const newEquipment = new Equipment(req.body);
      const savedEquipment = await newEquipment.save();
      res.status(201).json(savedEquipment);
    } catch (error) {
      console.error("Error when creating equipment:", error);
      res.status(400).json({
        message: 'Failed to create new equipment',
        error: error.message, // Provide more specific error message
        stack: error.stack    // Optionally include the stack trace for deeper analysis
      });
    }
  },

  // Get all equipment items
  async getAllEquipment(req, res) {
    try {
      const equipments = await Equipment.find({ user: req.user.id });
      res.status(200).json(equipments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get equipment', error });
    }
  },

  // Get a single equipment item by ID
  async getEquipmentById(req, res) {
    try {
      const equipment = await Equipment.findById(req.params.id);
      if (!equipment) {
        res.status(404).json({ message: 'Equipment not found' });
      } else {
        res.status(200).json(equipment);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to get equipment', error });
    }
  },

  // Update an equipment item
  async updateEquipment(req, res) {
    try {
      const updatedEquipment = await Equipment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedEquipment) {
        res.status(404).json({ message: 'Equipment not found' });
      } else {
        res.status(200).json(updatedEquipment);
      }
    } catch (error) {
      res.status(400).json({ message: 'Failed to update equipment', error });
    }
  },

  // Delete an equipment item
  async deleteEquipment(req, res) {
    try {
      const result = await Equipment.findByIdAndDelete(req.params.id);
      if (result) {
        res.status(200).json({ message: 'Equipment deleted successfully' });
      } else {
        res.status(404).json({ message: 'Equipment not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete equipment', error });
    }
  }
};

module.exports = equipmentController;