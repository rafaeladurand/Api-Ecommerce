const mongoose = require('mongoose');

const ProductSchema = new Schema({
    name : {type: String, required: true},
    currentPrice : {type: Number, required: true},
    promotionPrice : {type: Number, required: true},
    type: {type: String, required: true},
    description : {type: String, required: true},   
    expirationDate : {type: Date, required: true},
}, {timestamps: true} );

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;