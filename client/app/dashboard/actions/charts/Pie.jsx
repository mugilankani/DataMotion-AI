import React, { useEffect, useRef } from "react";

import { motion } from "framer-motion";
import { gsap } from "gsap";

const InteractivePieChart = () => {
  const chartRef = useRef(null);

  const data = [
    { label: "Category A", value: 30, color: "#FF6347" }, // Tomato
    { label: "Category B", value: 45, color: "#32CD32" }, // LimeGreen
    { label: "Category C", value: 25, color: "#1E90FF" }, // DodgerBlue
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;

  useEffect(() => {
    if (chartRef.current) {
      gsap.from(chartRef.current.children, {
        scale: 0,
        opacity: 0,
        duration: 2,
        stagger: 0.3,
        ease: "elastic.out(1, 0.5)",
        transformOrigin: "center",
      });
    }
  }, []);

  const radius = 150;
  const centerX = 200;
  const centerY = 200;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="mb-6 text-3xl font-bold">Interactive Pie Chart</h2>
      <svg ref={chartRef} width="400" height="400" viewBox="0 0 400 400">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const endAngle = startAngle + angle;
          const largeArcFlag = angle > 180 ? 1 : 0;
          const startX =
            centerX + radius * Math.cos((startAngle * Math.PI) / 180);
          const startY =
            centerY + radius * Math.sin((startAngle * Math.PI) / 180);
          const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
          const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

          const pathData = [
            `M ${centerX},${centerY}`,
            `L ${startX},${startY}`,
            `A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`,
            "Z",
          ].join(" ");

          const midAngle = startAngle + angle / 2;
          const labelX =
            centerX + (radius + 30) * Math.cos((midAngle * Math.PI) / 180);
          const labelY =
            centerY + (radius + 30) * Math.sin((midAngle * Math.PI) / 180);

          startAngle = endAngle;

          return (
            <g key={item.label}>
              <motion.path
                d={pathData}
                fill={item.color}
                initial={{ opacity: 0.6 }}
                whileHover={{
                  opacity: 1,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                style={{ transformOrigin: "center" }}
              />
              <motion.text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#333"
                fontSize="14"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 + index * 0.3, duration: 1 }}
              >
                {item.label}
                <tspan x={labelX} dy="20" fontSize="12" fontWeight="normal">
                  {item.value}%
                </tspan>
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default InteractivePieChart;
