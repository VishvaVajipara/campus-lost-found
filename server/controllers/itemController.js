const mongoose = require('mongoose');
const Item = require('../models/Item');

const REQUIRED_FIELDS = ['title', 'type', 'category', 'description', 'location', 'date', 'contactInfo'];

// Returns an error message if any required field is missing, otherwise null
const findMissingField = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || !String(body[field]).trim()) {
      return `Please provide: ${field}`;
    }
  }
  return null;
};

// Makes user-typed text safe to use inside a regular expression
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// POST /api/items
const createItem = async (req, res, next) => {
  try {
    const missing = findMissingField(req.body);
    if (missing) return res.status(400).json({ message: missing });

    const { title, type, category, description, location, date, contactInfo } = req.body;

    // "user" always comes from the token, never from the request body
    const item = await Item.create({
      title, type, category, description, location, date, contactInfo,
      user: req.user._id,
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
};

// GET /api/items?type=lost&category=Keys&search=key&location=library&status=active&page=1
const getItems = async (req, res, next) => {
  try {
    const { type, category, search, location, status = 'active', sort = 'newest' } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 9; // items per page

    // Build the MongoDB filter step by step
    const filter = {};
    if (type === 'lost' || type === 'found') filter.type = type;
    if (category) filter.category = category;
    if (status === 'active' || status === 'resolved') filter.status = status; // "all" = no status filter
    if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' }; // case-insensitive
    if (location) filter.location = { $regex: escapeRegex(location), $options: 'i' };

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const totalItems = await Item.countDocuments(filter);
    const items = await Item.find(filter)
      .populate('user', 'name') // replace the user id with the user's name
      .sort({ createdAt: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      items,
      page,
      totalPages: Math.max(Math.ceil(totalItems / limit), 1),
      totalItems,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/items/my-items  (protected)
const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

// GET /api/items/:id  (protected)
const getItemById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const item = await Item.findById(req.params.id).populate('user', 'name');
    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json({ item });
  } catch (error) {
    next(error);
  }
};

// Finds an item and checks that the logged-in user owns it.
// Returns the item, or sends an error response and returns null.
const findOwnedItem = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ message: 'Item not found' });
    return null;
  }
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404).json({ message: 'Item not found' });
    return null;
  }
  // Ownership check: compare the item's owner id with the logged-in user's id
  if (item.user.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: 'You can only change your own reports' });
    return null;
  }
  return item;
};

// PUT /api/items/:id  (protected, owner only)
const updateItem = async (req, res, next) => {
  try {
    const item = await findOwnedItem(req, res);
    if (!item) return;

    const missing = findMissingField(req.body);
    if (missing) return res.status(400).json({ message: missing });

    const { title, type, category, description, location, date, contactInfo } = req.body;
    Object.assign(item, { title, type, category, description, location, date, contactInfo });

    await item.save(); // save() runs the model validation again
    res.json({ item });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/items/:id/status  (protected, owner only)
const updateItemStatus = async (req, res, next) => {
  try {
    const item = await findOwnedItem(req, res);
    if (!item) return;

    const { status } = req.body;
    if (status !== 'active' && status !== 'resolved') {
      return res.status(400).json({ message: 'Status must be active or resolved' });
    }

    item.status = status;
    await item.save();
    res.json({ item });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/items/:id  (protected, owner only)
const deleteItem = async (req, res, next) => {
  try {
    const item = await findOwnedItem(req, res);
    if (!item) return;

    await item.deleteOne();
    res.json({ message: 'Report deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createItem, getItems, getMyItems, getItemById, updateItem, updateItemStatus, deleteItem };
