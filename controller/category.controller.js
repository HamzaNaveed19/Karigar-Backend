import Category from "../model/Category.model.js";


export const addCategory = async (req, res) => {
  const { category } = req.body;

  try {
    let categoryDoc = await Category.findOne();

    if (!categoryDoc) {
      const newCategoryDoc = new Category({
        category: category
      });
      
      await newCategoryDoc.save();
      return res.status(201).json({
        message: "Category document created and categories added.",
        data: newCategoryDoc.category
      });
    }

    categoryDoc.category.push(...category);
    await categoryDoc.save();

    res.status(201).json({
      message: "Categories added to existing document.",
      data: categoryDoc.category
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};




export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
};
