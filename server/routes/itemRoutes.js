const express = require('express');
const {
  createItem, getItems, getMyItems, getItemById, updateItem, updateItemStatus, deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All item routes need a logged-in user
router.use(protect);

router.post('/', createItem);
router.get('/', getItems);
router.get('/my-items', getMyItems); // must be above '/:id', otherwise "my-items" is read as an id
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.patch('/:id/status', updateItemStatus);
router.delete('/:id', deleteItem);

module.exports = router;
