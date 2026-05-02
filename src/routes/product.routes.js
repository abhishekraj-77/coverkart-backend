const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', productController.getAllProducts);
router.post('/', authMiddleware, productController.createProduct);
router.get('/:id', productController.getProductById);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;