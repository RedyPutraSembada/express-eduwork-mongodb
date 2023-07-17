const { MongoClient } = require("mongodb");

const url = 'mongodb://redyputra:redyputra123@localhost:27017?authSource=admin';
const client = new MongoClient(url);

(async () => {
    try {
        await client.connect();
        console.log('Koneksi terhubung');
    } catch (error) {
        console.log(error);
    }
})();

const db = client.db('eduwork-native');

module.exports = db;