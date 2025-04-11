import { useState } from "react";

const predefinedCategories = [
  { id: "1", name: "Food", type: "expense" },
  { id: "2", name: "Transport", type: "expense" },
  { id: "3", name: "Salary", type: "income" },
  { id: "4", name: "Freelance", type: "income" },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState(predefinedCategories);
  const [newCategory, setNewCategory] = useState({ name: "", type: "expense" });

  const handleAddCategory = () => {
    if (newCategory.name) {
      const updatedCategories = [...categories, { ...newCategory, id: Date.now().toString() }];
      setCategories(updatedCategories);
      setNewCategory({ name: "", type: "expense" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Управління категоріями</h1>

      <div className="mb-6">
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          placeholder="Назва категорії"
          className="input input-bordered w-full mb-2"
        />
        <select
          value={newCategory.type}
          onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
          className="select select-bordered w-full"
        >
          <option value="expense">Витрати</option>
          <option value="income">Доходи</option>
        </select>
        <button
          onClick={handleAddCategory}
          className="btn btn-primary mt-4"
        >
          Додати категорію
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl mb-2">Доступні категорії</h2>
        {categories.map((category) => (
          <div key={category.id} className="flex justify-between mb-2">
            <span>{category.name} ({category.type})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
