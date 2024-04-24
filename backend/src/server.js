require('dotenv').config();

const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
// const cors = require('cors');
const PORT = process.env.PORT || 5050;

// database.js
const mongoose = require('../config/database.js');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });