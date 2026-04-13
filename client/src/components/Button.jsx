import React from 'react';

export default function Button({ text, onClick, type = 'button', className = '', variant = 'primary' }) {
    const baseStyles = "relative overflow-hidden px-6 py-2.5 rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-blue-500/20",
        secondary: "bg-white dark:bg-surface text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
        danger: "bg-red-500 text-white hover:bg-red-600"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {text}
        </button>
    );
}
