import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  category: [
    {
      name: { type: String, required: true, unique: true },
      icon: { type: String, required: true },
      description: { type: String, required: true },
      color: { type: String, required: true }
    },
  ]
});


const Category = mongoose.model("Category", CategorySchema);
export default Category;
