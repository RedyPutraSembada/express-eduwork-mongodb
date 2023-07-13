const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads' });
const ProductController = require('../controller/ProductController');

router.get('/product', ProductController.index);

router.post('/product', upload.single('image'), ProductController.store);

router.get('/product/:id', ProductController.show);

router.put('/product/:id', upload.single('image'), ProductController.update);

router.delete('/product/:id', ProductController.destroy);

module.exports = router;