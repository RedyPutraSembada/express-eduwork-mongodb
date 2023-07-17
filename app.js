require('./config/mongoose');
const cors = require('cors');

const express = require('express');
const path = require('path');
const logger = require('morgan');
const router = require('./app/router/routes');
const routerV1 = require('./app/router/routesMDB');
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/', routerV1);
app.use('/api/v2/', router);
app.use((req, res, next) => {
    res.status(404);
    res.send({
        status: 'failed',
        message: `Resource ${req.originalUrl} Not Found`
    });
});
app.listen(3000, () => console.log('Server: http://localhost:3000'));