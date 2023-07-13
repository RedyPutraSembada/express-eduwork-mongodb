require('./config/mongoose');

const express = require('express');
const path = require('path');
const logger = require('morgan');
const router = require('./app/router/routes');
const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use('/api/', router);
app.use((req, res, next) => {
    res.status(404);
    res.send({
        status: 'failed',
        message: `Resource ${req.originalUrl} Not Found`
    });
});
app.listen(3000, () => console.log('Server: http://localhost:3000'));