const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads' });
const MongoDBProductController = require('../controller/MongoDBProductController');

router.get('/product', MongoDBProductController.index);

router.get('/product/:id', MongoDBProductController.view);

router.post('/product', upload.single('image'), MongoDBProductController.store);

router.put('/product/:id', upload.single('image'), MongoDBProductController.update);

router.delete('/product/:id', MongoDBProductController.destroy);

module.exports = router;