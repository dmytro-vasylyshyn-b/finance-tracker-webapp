import { useState } from "react";
import { fakeIncome, fakeExpenses } from "../data/fakeData";

const predefinedCategories = [
  { id: "1", name: "Food", type: "expense" },
  { id: "2", name: "Transport", type: "expense" },
  { id: "3", name: "Salary", type: "income" },
  { id: "4", name: "Freelance", type: "income" },
];

export default function Dashboard() {
  const [income, setIncome] = useState(fakeIncome);
  const [expenses, setExpenses] = useState(fakeExpenses);
  const [categories, setCategories] = useState(predefinedCategories);

  const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);
  const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Дашборд</h1>

      <div className="mb-6">
        <h2 className="text-2xl">Баланс</h2>
        <p className={`text-3xl ${balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
          {balance} грн
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl mb-2">Доходи</h2>
        {income.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.category}</span>
            <span>{item.amount} грн</span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl mb-2">Витрати</h2>
        {expenses.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.category}</span>
            <span>{item.amount} грн</span>
          </div>
        ))}
      </div>
    </div>
  );
}
