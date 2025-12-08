const express = require('express');
const router = express.Router();
const { addProduct, fetchAllProducts, editProduct,deleteProduct,handleImageUpload } = require('../../controllers/admin/product.controller');

const { upload } = require("../../helpers/cloudinary");

router.post('/upload-image', upload.single('my_file'), handleImageUpload);
router.post('/add-product', addProduct);
router.get('/products', fetchAllProducts);
router.put('/edit-product/:id', editProduct);
router.delete('/delete-product/:id', deleteProduct);

module.exports = router;