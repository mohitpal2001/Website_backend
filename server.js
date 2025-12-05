const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth/authroute.js');
const adminProductRoutes = require('./routes/admin/product-route.js');


mongoose.connect('mongodb+srv://mohit:pal2001@cluster0.yst7ouy.mongodb.net/').then(()=>{console.log("Connected to MongoDB")}
).catch((err)=>console.log(err));


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization","Cache-Control","Expires","pragma"],
    credentials:true
}))

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/admin/products',adminProductRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

