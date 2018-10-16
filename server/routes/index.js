const express = require('express');
const app = express();

app.use(require('./unidaddemedida'));


module.exports = app;