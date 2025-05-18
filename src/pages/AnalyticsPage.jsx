import React, { useState, useEffect, useRef } from "react";
import axios from '../api/axios';
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
import Button from "@/components/ui/button";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function FinanceDashboard() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("ALL");

  const chartRef = useRef(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedType !== "ALL") params.append("type", selectedType.toUpperCase());
      if (startDate) params.append("fromDate", startDate.toISOString().split("T")[0]);
      if (endDate) params.append("toDate", endDate.toISOString().split("T")[0]);
  
      const url = `/api/expenses/filtered?page=0&size=10&sort=date,desc&${params.toString()}`;
  
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      setExpenses(res.data?.content || []);
    } catch (err) {
      console.error("Не вдалося завантажити транзакції", err);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const isValidDateRange = !startDate || !endDate || new Date(startDate) <= new Date(endDate);

  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    const matchDate = !startDate || !endDate || (date >= new Date(startDate) && date <= new Date(endDate));
    const matchType = selectedType === "ALL" || e.type === selectedType;
    return matchDate && matchType;
  });

  const totalIncome = filteredExpenses
    .filter((e) => e.type === "INCOME")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = filteredExpenses
    .filter((e) => e.type === "EXPENSE")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalInvestments = filteredExpenses
    .filter((e) => e.type === "INVESTMENT")
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses - totalInvestments;
  const savings = totalIncome * 0.25;

  const monthly = filteredExpenses.reduce((acc, e) => {
    const date = new Date(e.date);
    const month = date.toLocaleString("default", { month: "short" });
    if (!acc[month]) acc[month] = { month, income: 0, expenses: 0, investment: 0 };
    if (e.type === "INCOME") acc[month].income += e.amount;
    else if (e.type === "EXPENSE") acc[month].expenses += e.amount;
    else if (e.type === "INVESTMENT") acc[month].investment += e.amount;
    return acc;
  }, {});
  const monthlyData = Object.values(monthly);

  const expensesByCategory = filteredExpenses
    .filter((e) => e.type === "EXPENSE")
    .reduce((acc, e) => {
      if (!acc[e.categoryName]) acc[e.categoryName] = 0;
      acc[e.categoryName] += e.amount;
      return acc;
    }, {});
  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredExpenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "finance_data.xlsx");
  };

  const exportToPDF = () => {
    if (!chartRef.current) return;
    html2canvas(chartRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("finance_dashboard.pdf");
    });
  };

  return (
    <div className="p-6 grid gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">Balance</h2>
            <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">Savings</h2>
            <p className="text-2xl font-bold">${savings.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">Income</h2>
            <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">Expenses</h2>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <DatePicker selected={startDate} onChange={setStartDate} />
        <DatePicker selected={endDate} onChange={setEndDate} />
        <select
          className="border p-2 rounded"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expenses</option>
          <option value="INVESTMENT">Investments</option>
        </select>
        <Button onClick={fetchData} disabled={isLoading || !isValidDateRange}>
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
        <Button onClick={exportToExcel}>Export Excel</Button>
        <Button onClick={exportToPDF}>Export PDF</Button>
      </div>

      {!isValidDateRange && (
        <p className="text-red-500">Start date must be earlier than or equal to end date</p>
      )}

      <div ref={chartRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
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
                <Area type="monotone" dataKey="income" stroke="#82ca9d" fill="url(#colorInc)" />
                <Area type="monotone" dataKey="expense" stroke="#8884d8" fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categoryData.map((entry, index) => (
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
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#82ca9d" />
              <Bar dataKey="expense" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
