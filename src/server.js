'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');

// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const logger = require('./middleware/logger.js');

const authRoutes = require('./auth/routes/routes.js');
const v1Routes = require('./auth/routes/v1.js');
const v2Routes = require('./auth/routes/v2.js');

// Prepare the express app
const app = express();

// App Level middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use(authRoutes);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Server Up on ${port}`));
  },
};
