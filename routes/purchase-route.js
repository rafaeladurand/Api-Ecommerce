const express = require('express');
const router = express.Router();
const { createPurchase, getAllPurchases, getPurchase, deletePurchase, getProductPurchases, updatePaymentStatus } = require('../controllers/purchase-controller');


router.post('/create', createPurchase);
router.get('/', getAllPurchases);
router.get('/:id', getPurchase);
router.delete('/:id', deletePurchase);
router.get('/:productId/purchases', getProductPurchases);
router.put("/:id/payment", updatePaymentStatus);


module.exports = router;
