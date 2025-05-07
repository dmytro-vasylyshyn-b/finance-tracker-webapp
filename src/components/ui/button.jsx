// src/components/ui/button.jsx
import React from 'react';

const Button = ({ children, onClick, className, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
