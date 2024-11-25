"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

// Custom color definitions (replace with your desired colors)
const colors = {
	primary: "#FF6384",
	secondary: "#36A2EB",
	tertiary: "#FF33A6",
	quaternary: "#33FF57",
	quinary: "#FFD633",
};

const InteractiveBarChart = () => {
	const chartRef = useRef(null);

	const data = [
		{ label: "Class A", value: 77, color: colors.primary },
		{ label: "Class B", value: 65, color: colors.secondary },
	];

	useEffect(() => {
		if (chartRef.current) {
			gsap.from(chartRef.current.querySelectorAll(".bar"), {
				scaleY: 0,
				duration: 2,
				stagger: 0.3,
				ease: "elastic.out(1, 0.5)",
				transformOrigin: "bottom",
			});
		}
	}, []);

	const maxValue = Math.max(...data.map((item) => item.value));
	const chartHeight = 300;
	const barWidth = 60;
	const chartWidth = data.length * barWidth + (data.length - 1) * 20;

	return (
		<div className="flex flex-col items-center justify-center p-8">
			<h2 className="text-3xl font-bold mb-6">Interactive Bar Chart</h2>
			<svg
				ref={chartRef}
				width={chartWidth}
				height={chartHeight + 50}
				viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`}
			>
				{data.map((item, index) => {
					const barHeight = (item.value / maxValue) * chartHeight;
					const x = index * (barWidth + 20);
					const y = chartHeight - barHeight;

					return (
						<g key={item.label}>
							<motion.rect
								className="bar"
								x={x}
								y={y}
								width={barWidth}
								height={barHeight}
								fill={item.color} // Custom color applied here
								initial={{ opacity: 0.6 }}
								whileHover={{
									opacity: 1,
									scale: 1.05,
									transition: { duration: 0.3 },
								}}
								style={{
									transformOrigin: `${
										x + barWidth / 2
									}px ${chartHeight}px`,
								}}
							/>
							<text
								x={x + barWidth / 2}
								y={chartHeight + 20}
								textAnchor="middle"
								fill="#333"
								fontSize="14"
								fontWeight="bold"
							>
								{item.label}
							</text>
							<text
								x={x + barWidth / 2}
								y={y - 10}
								textAnchor="middle"
								fill="#333"
								fontSize="12"
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

export default InteractiveBarChart;
