const express = require('express');
const router = express.Router();
const { createPurchase, getAllPurchases, getPurchase, deletePurchase, getProductPurchases } = require('../controllers/purchaseController');


router.post('/create', createPurchase);
router.get('/', getAllPurchases);
router.get('/:id', getPurchase);
router.delete('/:id', deletePurchase);
router.get('/:productId/purchases', getProductPurchases);

module.exports = router;
