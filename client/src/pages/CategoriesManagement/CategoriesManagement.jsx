import React, { useEffect, useState } from "react";
import CategoryList from "../../components/AdminPages/Categories/CategoryList";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../http/productAPI";
import { observer } from "mobx-react-lite";
import './CategoriesManagement.css';

const getCategoryPath = (category, categories) => {
  const path = [];
  let current = category;

  while (current) {
    path.unshift(current.name);
    current = categories.find((c) => c.id === current.parentId);
  }

  return path.join(" > ");
};

const CategoriesManagement = observer(() => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", parentId: null });
  const [updateData, setUpdateData] = useState({ id: "", name: "" });
  const [deleteId, setDeleteId] = useState("");

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

const handleCreate = async (e) => {
  e.preventDefault();
  console.log("Створення категорії з даними:", newCategory); // <-- лог
  try {
    await createCategory(newCategory);
    setNewCategory({ name: "", parentId: null });
    loadCategories();
  } catch (error) {
    console.error("Помилка при створенні категорії:", error); // <-- лог помилки
  }
};


  const handleUpdate = async (e) => {
    e.preventDefault();
    if (updateData.id && updateData.name) {
      await updateCategory(updateData.id, { name: updateData.name });
      setUpdateData({ id: "", name: "" });
      loadCategories();
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (deleteId) {
      await deleteCategory(deleteId);
      setDeleteId("");
      loadCategories();
    }
  };

  return (
    <div className="container-fluid container-xxl">
      <div className="d-flex justify-content-between">
        <div>
          <div className="d-flex">
            <p className="category-list-title mt-3">Категорії</p>
          </div>
          <CategoryList categories={categories} />
        </div>
        <div className="d-flex flex-column mt-3">
          <form className="d-flex flex-column mb-5" onSubmit={handleCreate}>
            <p className="category-form-title">Додати категорію</p>
            <input
              type="text"
              placeholder="Назва категорії"
              className="mb-2 category-input"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <select
              className="mb-2 category-input"
              value={newCategory.parentId || ""}
              onChange={(e) => setNewCategory({ ...newCategory, parentId: e.target.value || null })}
            >
              <option value="" disabled hidden>Батьківська категорія</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryPath(category, categories)}
                </option>
              ))}
            </select>
            <button className="btn-category-create">Додати категорію</button>
          </form>

          <form className="d-flex flex-column mb-5" onSubmit={handleUpdate}>
            <p className="category-form-title">Змінити назву категорії</p>
            <select
              className="mb-2 category-input"
              value={updateData.id}
              onChange={(e) => setUpdateData({ ...updateData, id: e.target.value })}
            >
              <option value="" disabled hidden>Категорія</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryPath(category, categories)}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Нова назва категорії"
              className="mb-2 category-input"
              value={updateData.name}
              onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
            />
            <button className="btn-category-change">Застосувати зміни</button>
          </form>

          <form className="d-flex flex-column" onSubmit={handleDelete}>
            <p className="category-form-title">Видалити категорію</p>
            <select
              className="mb-2 category-input"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
            >
              <option value="" disabled hidden>Категорія</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryPath(category, categories)}
                </option>
              ))}
            </select>
            <button className="btn-category-delete">Видалити</button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default CategoriesManagement;
