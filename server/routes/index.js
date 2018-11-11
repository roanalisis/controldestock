const express = require('express');
const app = express();

app.use(require('./unidaddemedida'));

app.use(require('./home'));


module.exports = app;