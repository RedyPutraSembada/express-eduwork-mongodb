const mongoose = require('mongoose');
mongoose.connect('mongodb://redyputra:redyputra123@127.0.0.1:27017/eduwork-mongoose?authSource=admin');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => console.log('Server Database Terhubung'));