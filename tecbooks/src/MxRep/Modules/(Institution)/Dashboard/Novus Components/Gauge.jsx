import React from 'react';

function Gauge({ percentage, size, metric }) {
    const radius = 50; // Radius of the circle
    const circumference = 2 * Math.PI * radius; // Circumference of the circle
    const offset = circumference - (percentage / 100) * circumference; // Calculate dash offset

    let heightREM

    if (metric == "oee") {
        heightREM = 8
    } else {
        heightREM = 6
    }

    // Determine colors based on percentage
    let progressColor, textColorClass;
    if (percentage < 33) {
        progressColor = '#EF4444'; // Red
    } else if (percentage < 66) {
        progressColor = '#FFA500'; // Orange
    } else {
        progressColor = '#22C55E'; // Green
    }

    return (
        <svg className="circle-container" viewBox={`0 0 ${size} ${size}`} style={{ height: `${heightREM}rem`}}>
            {/* Background Circle */}
            <circle
                cx={`${size/2}`}
                cy={`${size/2}`}
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
            />

            {/* Progress Circle */}
            <circle
                cx={`${size/2}`}
                cy={`${size/2}`}
                r={radius}
                stroke={progressColor}
                strokeWidth="10"
                fill="none"
                // strokeLinecap="round"
                style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: offset + 0,
                    transition: 'stroke-dashoffset 0.5s ease',
                }}
            />

            {/* Text Inside the Circle */}
            <text
                x={`${size/2}`}
                y={`${size/2 + 5}`}
                textAnchor="middle"
                fontSize="20"
                fontWeight="bold"
                fill={progressColor}
            >
                
                {percentage}%
            </text>
        </svg>
    );
}

export default Gauge;
