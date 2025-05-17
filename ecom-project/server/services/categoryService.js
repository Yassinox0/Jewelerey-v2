const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Get all categories
const getAllCategories = async () => {
  const db = getDB();
  const categories = await db.collection('categories').find().toArray();
  return categories;
};

// Get category by ID
const getCategoryById = async (id) => {
  const db = getDB();
  const category = await db.collection('categories').findOne({ _id: new ObjectId(id) });
  return category;
};

// Get category by slug
const getCategoryBySlug = async (slug) => {
  const db = getDB();
  const category = await db.collection('categories').findOne({ slug: slug });
  return category;
};

// Create category
const createCategory = async (categoryData) => {
  const db = getDB();
  // Create a slug if not provided
  if (!categoryData.slug) {
    categoryData.slug = categoryData.name.toLowerCase().replace(/\s+/g, '-');
  }
  
  const result = await db.collection('categories').insertOne(categoryData);
  return { ...categoryData, _id: result.insertedId };
};

// Update category
const updateCategory = async (id, categoryData) => {
  const db = getDB();
  await db.collection('categories').updateOne(
    { _id: new ObjectId(id) },
    { $set: categoryData }
  );
  return getCategoryById(id);
};

// Delete category
const deleteCategory = async (id) => {
  const db = getDB();
  
  // Check if category has products
  const productCount = await db.collection('products').countDocuments({ 
    category_id: new ObjectId(id)
  });
  
  if (productCount > 0) {
    throw new Error(`Cannot delete category with ${productCount} products. Reassign products first.`);
  }
  
  const result = await db.collection('categories').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
}; 