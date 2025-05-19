import React, { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  Legend, ScatterChart, Scatter
} from "recharts";
import { Card, CardContent } from "@/components/ui/cards";
import { DatePicker } from "@/components/ui/datepicker";
import Button from "@/components/ui/button";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];

export default function FinanceDashboard() {
  const { t } = useTranslation();
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

      const url = `/api/expenses/filtered?page=0&size=1000&sort=date,desc&${params.toString()}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setExpenses(res.data?.content || []);
    } catch (err) {
      console.error(t("fetch_error"), err);
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

  const totalIncome = filteredExpenses.filter((e) => e.type === "INCOME").reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = filteredExpenses.filter((e) => e.type === "EXPENSE").reduce((sum, e) => sum + e.amount, 0);
  const totalInvestments = filteredExpenses.filter((e) => e.type === "INVESTMENTS").reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses - totalInvestments;
  const savings = totalIncome * 0.25;

  const monthly = filteredExpenses.reduce((acc, e) => {
    const date = new Date(e.date);
    const month = date.toLocaleString("default", { month: "short" });
    if (!acc[month]) acc[month] = { month, income: 0, expenses: 0, investment: 0 };
    if (e.type === "INCOME") acc[month].income += e.amount;
    else if (e.type === "EXPENSE") acc[month].expenses += e.amount;
    else if (e.type === "INVESTMENTS") acc[month].investment += e.amount;
    return acc;
  }, {});
  const monthlyData = Object.values(monthly);

  const pieData = (() => {
    const filtered = selectedType === "ALL" ? filteredExpenses : filteredExpenses.filter((e) => e.type === selectedType);
    const grouped = filtered.reduce((acc, e) => {
      const key = e.categoryName || e.type;
      acc[key] = (acc[key] || 0) + e.amount;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  })();

  // ✅ Новий формат ScatterChart: групування по даті (yyyy-mm-dd)
  const formatDate = (date) => new Date(date).toISOString().split("T")[0];
  const scatterDataMap = {
    income: {},
    expenses: {},
    investments: {},
  };

  filteredExpenses.forEach((e) => {
    const dateStr = formatDate(e.date);
    const type = e.type.toUpperCase(); // нормалізуємо до ВЕЛИКИХ літер
  
    switch (type) {
      case "INCOME":
        if (!scatterDataMap.income[dateStr]) scatterDataMap.income[dateStr] = 0;
        scatterDataMap.income[dateStr] += e.amount;
        break;
      case "EXPENSE":
        if (!scatterDataMap.expenses[dateStr]) scatterDataMap.expenses[dateStr] = 0;
        scatterDataMap.expenses[dateStr] += e.amount;
        break;
      case "INVESTMENTS":
        if (!scatterDataMap.investments[dateStr]) scatterDataMap.investments[dateStr] = 0;
        scatterDataMap.investments[dateStr] += e.amount;
        break;
      default:
        console.warn("Невідомий тип транзакції:", e.type);
    }
  });
  

  const scatterData = {
    income: Object.entries(scatterDataMap.income).map(([date, amount]) => ({ date, amount })),
    
    expenses: Object.entries(scatterDataMap.expenses).map(([date, amount]) => ({ date, amount })),
    investments: Object.entries(scatterDataMap.investments).map(([date, amount]) => ({ date, amount })),
  };

  console.log("Scatter Data Expenses:", scatterData.expenses);


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
    <div className="p-6 grid gap-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Summary Cards */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">{t("balance")}</h2>
            <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">{t("savings")}</h2>
            <p className="text-2xl font-bold">${savings.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">{t("income")}</h2>
            <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="text-center p-4">
            <h2 className="text-lg font-semibold">{t("expenses")}</h2>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <DatePicker selected={startDate} onChange={setStartDate} />
        <DatePicker selected={endDate} onChange={setEndDate} />
        <select
          className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="ALL">{t("all")}</option>
          <option value="INCOME">{t("income")}</option>
          <option value="EXPENSE">{t("expenses")}</option>
          <option value="INVESTMENTS">{t("investments")}</option>
        </select>
        <Button onClick={fetchData} disabled={isLoading || !isValidDateRange}>
          {isLoading ? t("refreshing") : t("refresh")}
        </Button>
        <Button onClick={exportToExcel}>{t("download_excel")}</Button>
        <Button onClick={exportToPDF}>{t("download_pdf")}</Button>
      </div>

      {!isValidDateRange && (
        <p className="text-red-500">{t("invalid_date_range")}</p>
      )}

      <div ref={chartRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">{t("monthly_overview")}</h3>
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
                  <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#82ca9d" fill="url(#colorInc)" />
                <Area type="monotone" dataKey="expenses" stroke="#8884d8" fill="url(#colorExp)" />
                <Area type="monotone" dataKey="investment" stroke="#ffc658" fill="url(#colorInv)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">{t("pie_chart_by_category")}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
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

      {/* Bar Chart */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">{t("bar_chart_comparison")}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#82ca9d" />
              <Bar dataKey="expenses" fill="#8884d8" />
              <Bar dataKey="investment" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ✅ Scatter Chart by Day */}
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">{t("scatter_chart_by_day")}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid />
              <XAxis dataKey="date" name="Date" type="category" />
              <YAxis dataKey="amount" name="Amount" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => [`$${value}`, name]}
              />
              <Legend />
              <Scatter
                name={t("income")}
                data={scatterData.income}
                fill="#82ca9d"
                line={true}  // <-- додаємо тут
              />
              <Scatter
                name={t("expenses")}
                data={scatterData.expenses}
                fill="#8884d8"
                line={true}  // <-- і тут
              />
              <Scatter
                name={t("investments")}
                data={scatterData.investments}
                fill="#ffc658"
                line={true}  // <-- і тут
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
