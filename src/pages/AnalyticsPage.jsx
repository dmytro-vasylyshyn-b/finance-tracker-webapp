import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/cards";
import { DatePicker } from "@/components/ui/datepicker";
import Button from '@/components/ui/button';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const data = {
  summary: {
    balance: 5600,
    savings: 1400,
    income: 3000,
    expenses: 1600,
  },
  monthly: [
    { month: "Jan", income: 3000, expenses: 1600 },
    { month: "Feb", income: 2800, expenses: 1700 },
    { month: "Mar", income: 3200, expenses: 1500 },
    { month: "Apr", income: 3100, expenses: 1400 },
  ],
  expensesByCategory: [
    { name: "Food", value: 500 },
    { name: "Transport", value: 300 },
    { name: "Entertainment", value: 200 },
    { name: "Bills", value: 600 },
  ],
};

export default function FinanceDashboard() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="p-6 grid gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">Balance</h2>
            <p className="text-2xl font-bold">${data.summary.balance}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">Savings</h2>
            <p className="text-2xl font-bold">${data.summary.savings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">Income</h2>
            <p className="text-2xl font-bold">${data.summary.income}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">Expenses</h2>
            <p className="text-2xl font-bold">${data.summary.expenses}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <DatePicker selected={startDate} onChange={setStartDate} />
        <DatePicker selected={endDate} onChange={setEndDate} />
        <Button>Apply Filters</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.monthly}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#82ca9d" fillOpacity={1} fill="url(#colorInc)" />
                <Area type="monotone" dataKey="expenses" stroke="#8884d8" fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.expensesByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">Bar Chart Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#82ca9d" />
              <Bar dataKey="expenses" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}