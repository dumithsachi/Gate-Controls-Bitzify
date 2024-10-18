// routes/cardRoutes.js
const express = require('express');
const router = express.Router();
const { createCard, getCards, updateCard, deleteCard } = require('../controllers/cardController');

router.post('/createCard', createCard);
router.get('/', getCards);
router.put('/updateCard', updateCard);
router.delete('/deleteCard/:id', deleteCard);

module.exports = router;
