import React, { useEffect, useRef } from "react";

import { motion } from "framer-motion";
import { gsap } from "gsap";

const InteractiveLineChart = () => {
  const chartRef = useRef(null);

  const data = [
    { month: "Jan", value: 10 },
    { month: "Feb", value: 20 },
    { month: "Mar", value: 15 },
    { month: "Apr", value: 25 },
    { month: "May", value: 22 },
    { month: "Jun", value: 30 },
  ];

  const customColor = "#4CAF50"; // Custom color (Green)

  useEffect(() => {
    if (chartRef.current) {
      gsap.from(chartRef.current.querySelector(".line-path"), {
        strokeDashoffset: 1000,
        duration: 3,
        ease: "power3.out",
      });
      gsap.from(chartRef.current.querySelectorAll(".point"), {
        scale: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: "elastic.out(1, 0.5)",
      });
    }
  }, []);

  const maxValue = Math.max(...data.map((item) => item.value));
  const chartWidth = 400;
  const chartHeight = 300;
  const padding = 40;

  const xScale = (index) =>
    (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding;
  const yScale = (value) =>
    chartHeight - (value / maxValue) * (chartHeight - 2 * padding) - padding;

  const linePath = data
    .map(
      (item, index) =>
        `${index === 0 ? "M" : "L"} ${xScale(index)} ${yScale(item.value)}`,
    )
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="mb-6 text-3xl font-bold">Interactive Line Chart</h2>
      <svg
        ref={chartRef}
        width={chartWidth}
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        <motion.path
          className="line-path"
          d={linePath}
          fill="none"
          stroke={customColor} // Use custom color for the line
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        {data.map((item, index) => (
          <g key={item.month}>
            <motion.circle
              className="point"
              cx={xScale(index)}
              cy={yScale(item.value)}
              r="6"
              fill={customColor} // Use custom color for the circle
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 3 + index * 0.3, duration: 1 }}
              whileHover={{ scale: 1.5 }}
            />
            <text
              x={xScale(index)}
              y={chartHeight - padding / 2}
              textAnchor="middle"
              fill="#333"
              fontSize="12"
            >
              {item.month}
            </text>
            <text
              x={xScale(index)}
              y={yScale(item.value) - 15}
              textAnchor="middle"
              fill="#333"
              fontSize="12"
            >
              {item.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default InteractiveLineChart;
