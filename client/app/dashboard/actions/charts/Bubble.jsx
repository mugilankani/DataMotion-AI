import React, { useEffect, useRef } from "react";

import { motion } from "framer-motion";
import { gsap } from "gsap";

// Custom function to generate a color array
const getColorArray = (length) => {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A6",
    "#FFD633",
    "#33FFF6",
    "#FF8C33",
    "#9B33FF",
    "#FF3333",
    "#33FF85",
  ];
  return colors.slice(0, length); // Adjust the length of the array
};

const InteractiveBubbleChart = () => {
  const chartRef = useRef(null);

  const data = [
    { label: "A", x: 10, y: 40, size: 20 },
    { label: "B", x: 30, y: 70, size: 50 },
    { label: "C", x: 60, y: 30, size: 30 },
    { label: "D", x: 80, y: 60, size: 40 },
    { label: "E", x: 50, y: 50, size: 60 },
  ];

  const colorArray = getColorArray(data.length);

  useEffect(() => {
    if (chartRef.current) {
      gsap.from(chartRef.current.querySelectorAll(".bubble"), {
        scale: 0,
        duration: 2,
        stagger: 0.3,
        ease: "elastic.out(1, 0.5)",
      });
    }
  }, []);

  const chartWidth = 400;
  const chartHeight = 300;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="mb-6 text-3xl font-bold">Interactive Bubble Chart</h2>
      <svg
        ref={chartRef}
        width={chartWidth}
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        {data.map((item, index) => (
          <g key={item.label}>
            <motion.circle
              className="bubble"
              cx={item.x * 4}
              cy={chartHeight - item.y * 3}
              r={item.size}
              fill={colorArray[index]} // Custom color applied here
              initial={{ opacity: 0.6 }}
              whileHover={{
                opacity: 1,
                scale: 1.1,
                transition: { duration: 0.3 },
              }}
            />
            <text
              x={item.x * 4}
              y={chartHeight - item.y * 3}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize="12"
              fontWeight="bold"
            >
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default InteractiveBubbleChart;
