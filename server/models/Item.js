const mongoose = require('mongoose');

const CATEGORIES = [
  'ID Card',
  'Electronics',
  'Books & Stationery',
  'Wallet & Money',
  'Keys',
  'Bags',
  'Clothing',
  'Accessories',
  'Other',
];

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Item name is required'], trim: true, maxlength: 80 },
    type: {
      type: String,
      enum: { values: ['lost', 'found'], message: 'Type must be lost or found' },
      required: [true, 'Type is required'],
    },
    category: {
      type: String,
      enum: { values: CATEGORIES, message: 'Please choose a valid category' },
      required: [true, 'Category is required'],
    },
    description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 1000 },
    location: { type: String, required: [true, 'Location is required'], trim: true, maxlength: 100 },
    date: { type: Date, required: [true, 'Date is required'] },
    contactInfo: { type: String, required: [true, 'Contact information is required'], trim: true, maxlength: 100 },
    // Optional photo, stored as a small JPEG data URL (the browser shrinks it before upload)
    image: {
      type: String,
      default: '',
      validate: {
        validator: (value) => value === '' || (value.startsWith('data:image/jpeg;base64,') && value.length <= 400000),
        message: 'Photo must be a JPEG image under 300 KB',
      },
    },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
    // A reference to the User who posted this item
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true } // Mongoose adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('Item', itemSchema);
module.exports.CATEGORIES = CATEGORIES;
