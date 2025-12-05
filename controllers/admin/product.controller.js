const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");


const handleImageUpload = async (req, res) => {
    try{
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${b64}`;  
        const result = await imageUploadUtil(dataUrl);
        return  res.status(200).json({status:true, message: 'Image uploaded successfully', imageUrl: result.secure_url });

    }catch(error){
        return res.status(500).json({status:false, message: 'Image upload failed', error: error.message });
    }
}

module.exports = {
    handleImageUpload,
};


//add a new product
const addProduct = async (req, res) => {  
    try {
  const {image,title,description,price,category,brand,salePrice,TotalStock} = req.body;
  const newProduct = new Product({
    image,
    title,
    description,
    price,
    category,
    brand,
    salePrice,
    TotalStock
    }); 
    await newProduct.save();
    res.status(201).json({status:true, message: 'Product added successfully', product: newProduct }); 
    } catch (error) {
         res.status(500).json({status:false, message: 'Adding product failed', error: error.message });
    }
}


//fetch all product
const fetchAllProducts = async (req, res) => {
      
    try {
        const products = await Product.find({});
        res.status(200).json({status:true, message: 'Products fetched successfully', products });
        
    } catch (error) {
         res.status(500).json({status:false, message: 'Adding product failed', error: error.message });
    }
}


//edit prodduct
const editProduct = async (req, res) => {  
    try {

        const {id} = req.params;
        const {image,title,description,price,category,brand,salePrice,TotalStock} = req.body;
        const findProduct = await Product.findById(id);
        if(!findProduct){
            return res.status(404).json({status:false, message: 'Product not found' });
        }
        findProduct.image = image || findProduct.image;
        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.price = price || findProduct.price;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.salePrice = salePrice || findProduct.salePrice;
        findProduct.TotalStock = TotalStock || findProduct.TotalStock;
        await findProduct.save();
        res.status(200).json({status:true, message: 'Product updated successfully', product: findProduct });
        
    } catch (error) {
         res.status(500).json({status:false, message: 'Adding product failed', error: error.message });
    }

}



//delete product
const deleteProduct = async (req, res) => { 
    try {
        const {id} = req.params;
        const findProduct = await Product.findById(id);
        if(!findProduct){
            return res.status(404).json({status:false, message: 'Product not found' });
        }
        await Product.findByIdAndDelete(id);
        res.status(200).json({status:true, message: 'Product deleted successfully' });
    } catch (error) {
         res.status(500).json({status:false, message: 'Adding product failed', error: error.message });
    }

}

module.exports = {
    handleImageUpload,
    addProduct,
    fetchAllProducts,
    editProduct,
    deleteProduct
};