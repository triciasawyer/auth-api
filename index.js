'use strict';


require('dotenv').config();
const { db } = require('./src/auth/models');
const server = require('./src/server.js');
const PORT = process.env.PORT || 3001;

db.sync().then(() => {
  console.log('Server is running');
  server.start(PORT);
});
