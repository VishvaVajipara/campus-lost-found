const Item = require('../models/Item');

// GET /api/dashboard/stats  (protected)
const getDashboardStats = async (req, res, next) => {
  try {
    // countDocuments asks MongoDB to count the matching documents
    const totalLost = await Item.countDocuments({ type: 'lost', status: 'active' });
    const totalFound = await Item.countDocuments({ type: 'found', status: 'active' });
    const totalResolved = await Item.countDocuments({ status: 'resolved' });

    const recentItems = await Item.find({ status: 'active' })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({ totalLost, totalFound, totalResolved, recentItems });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
