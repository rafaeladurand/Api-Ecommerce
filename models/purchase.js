const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    //user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
   // product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    productName: {type: String, required: true},
    price: {type: Number, required: true},
    purchaseDate: {type: Date, default: Date.now},
}, {timestamps: true} );

const Purchase = mongoose.model('Purchase', PurchaseSchema);

module.exports = Purchase;