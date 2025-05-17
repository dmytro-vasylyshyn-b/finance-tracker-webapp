import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from 'lucide-react';

export function DatePicker({ selected, onChange, placeholder = "Оберіть дату", minDate, maxDate }) {
  return (
    <div className="relative w-full">
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <CalendarIcon className="h-4 w-4 text-gray-500" />
      </div>
    </div>
  );
}
