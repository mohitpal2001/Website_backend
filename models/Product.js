const mongoose = require('mongoose');

const ProductSchemea = new mongoose.Schema({

    image:String,
    title:String,
    description:String,
    price:Number,
    category:String,
    brand:String,
    salePrice:Number,
    TotalStock:Number,
},{
    timestamps:true
})

const Product = mongoose.model('Product',ProductSchemea);
module.exports = Product;