import React, { useEffect, useRef } from "react";

import { motion } from "framer-motion";
import { gsap } from "gsap";

const InteractiveRadarChart = () => {
  const chartRef = useRef(null);

  const data = [
    { attribute: "Speed", value: 80 },
    { attribute: "Power", value: 90 },
    { attribute: "Agility", value: 70 },
    { attribute: "Endurance", value: 85 },
    { attribute: "Technique", value: 75 },
  ];

  useEffect(() => {
    if (chartRef.current) {
      gsap.from(chartRef.current.querySelector(".radar-area"), {
        scale: 0,
        opacity: 0,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
        transformOrigin: "center",
      });
      gsap.from(chartRef.current.querySelectorAll(".radar-point"), {
        scale: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: "elastic.out(1, 0.5)",
      });
    }
  }, []);

  const chartSize = 300;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const radius = chartSize * 0.4;

  const getCoordinates = (index, value) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const x = centerX + radius * (value / 100) * Math.cos(angle);
    const y = centerY + radius * (value / 100) * Math.sin(angle);
    return { x, y };
  };

  const areaPath =
    data
      .map((item, index) => {
        const { x, y } = getCoordinates(index, item.value);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ") + "Z";

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="mb-6 text-3xl font-bold">Interactive Radar Chart</h2>
      <svg
        ref={chartRef}
        width={chartSize}
        height={chartSize}
        viewBox={`0 0 ${chartSize} ${chartSize}`}
      >
        {[20, 40, 60, 80, 100].map((level, index) => (
          <polygon
            key={level}
            points={data
              .map((_, i) => {
                const { x, y } = getCoordinates(i, level);
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#ccc"
            strokeWidth="0.5"
          />
        ))}
        <motion.path
          className="radar-area"
          d={areaPath}
          fill="#4CAF50" // Green color for radar area
          fillOpacity="0.5"
          stroke="#388E3C" // Darker green for the outline of the area
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        {data.map((item, index) => {
          const { x, y } = getCoordinates(index, item.value);
          return (
            <g key={item.attribute}>
              <motion.circle
                className="radar-point"
                cx={x}
                cy={y}
                r="6"
                fill="#FF9800" // Orange color for the radar points
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2 + index * 0.3, duration: 1 }}
                whileHover={{ scale: 1.5 }}
              />
              <text
                x={getCoordinates(index, 110).x}
                y={getCoordinates(index, 110).y}
                textAnchor="middle"
                fill="#333"
                fontSize="12"
              >
                {item.attribute}
              </text>
              <text
                x={x}
                y={y - 15}
                textAnchor="middle"
                fill="#333"
                fontSize="10"
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default InteractiveRadarChart;
