import React from 'react'

function Status({ variant, content, size = "md" }) {
    const sizeStyles = {
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-3.5 py-1.5 text-sm"
    }

    const variants = {
        "super": "border-[#03045e]-300 bg-[#03045e]-50 text-[#03045e]-700 shadow-sm",
        "normal": "border-[#0077b6]-300 bg-[#0077b6]-50 text-[#0077b6]-700 shadow-sm",
        "positive": "border-green-300 bg-green-50 text-green-700 shadow-sm",
        "default": "border-gray-300 bg-gray-50 text-gray-700 shadow-sm", 
        "negative": "border-red-300 bg-red-50 text-red-700 shadow-sm"
    }

    const currentVariant = variants[variant] || variants["default"]

    return (
        <span className={`inline-flex items-center border rounded-full font-medium ${sizeStyles[size]} ${currentVariant}`}>
            {content}
        </span>
    )
}

export default Status