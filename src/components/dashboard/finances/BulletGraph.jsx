import React from "react";

function BulletGraph({ min, max, value, colorSections = [] }) {

  // Calculate percentages for color sections
  const totalPercentage = colorSections.reduce(
    (sum, section) => sum + Object.values(section)[0],
    0
  );

  if (totalPercentage !== 100) {
    console.error("Color sections must add up to 100%.");
    return null;
  }

  // Convert value to a position on the graph
  const valuePosition = ((value - min) / (max - min)) * 100;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 100 1"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", minHeight: "60px" }}
      >
        {/* Render color sections */}
        {colorSections.reduce((acc, section, index) => {
          const [color, percentage] = Object.entries(section)[0];
          const xStart = acc.currentX;
          const xWidth = (percentage / 100) * 100; // Convert to SVG width
          acc.currentX += xWidth;

          acc.elements.push(
            <rect
              key={index}
              x={xStart}
              y="2"
              width={xWidth}
              height="4"
              fill={color}
            />
          );
          return acc;
        }, { currentX: 0, elements: [] }).elements}

        {/* Render tick marks */}
        {[...Array(11)].map((_, i) => (
          <line
            key={i}
            x1={(i * 10).toString()}
            y1="6"
            x2={(i * 10).toString()}
            y2={i % 2 === 0 ? "0" : "3"} // Longer tick for even indexes
            stroke="#000"
            strokeWidth="0.2"
          />
        ))}

        {/* Render triangle pointer */}
        <g>
            <polygon
                points={`${valuePosition},0 ${valuePosition - 3},-6 ${valuePosition + 3},-6`}
                fill={getTriangleColor(value, min, max, colorSections)}
                stroke="black"
                strokeWidth="1"
            />

            <text
                x={valuePosition + 10}  // Position label to the right of the triangle
                y={-5}                 // Align label vertically near the triangle
                fill="black"           // Text color
                fontSize="4px"        // Font size
                fontFamily="Arial, sans-serif" // Font family
            >
                {value}
            </text>
        </g>

      </svg>
    </div>
  );
}

// Helper function to get the triangle color based on value position
function getTriangleColor(value, min, max, colorSections) {
  const positionPercentage = ((value - min) / (max - min)) * 100;
  let accumulatedPercentage = 0;

  for (const section of colorSections) {
    const [color, percentage] = Object.entries(section)[0];
    accumulatedPercentage += percentage;
    if (positionPercentage <= accumulatedPercentage) {
      return color;
    }
  }
  return "black"; // Default color if out of range
}

export default BulletGraph;
