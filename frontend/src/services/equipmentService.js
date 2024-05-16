import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/equipment';

export const createEquipment = async (equipmentData) => {
  try {
    const response = await axios.post(API_BASE_URL, equipmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
};

export const getAllEquipment = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

export const getEquipmentById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment by ID:', error);
    throw error;
  }
};

export const updateEquipment = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating equipment:', error);
    throw error;
  }
};

export const deleteEquipment = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting equipment:', error);
    throw error;
  }
};

export const fetchDataFromDndApi = async (type, index) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/dndapi/${type}/${index}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
