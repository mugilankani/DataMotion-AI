"use server";

import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Initialize the Gemini model
const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash-latest",
  apiKey: process.env.GEMINI_API_KEY,
});

// Create an output parser for JSON structure
const parser = new JsonOutputParser();

// Prompt for generating graph JSON structure
const promptTemplatetogenerateJson = PromptTemplate.fromTemplate(
  `Please create a graph JSON structure based on the following prompt: 
   "{prompt}". 
   Ensure to generate the JSON in a format suitable for rendering various types of graphs (pie, bar, line, radar, bubble) with all relevant attributes such as labels, datasets, etc.
   The output should be structured in a clean and easily usable format:

   {{
  "title": "create a suitable title based on prompt",
  "type": "graph_type", // e.g., bar, line, pie, etc.
  "data": {{
    "labels": ["label1", "label2", "label3", ...],
    "datasets": [
      {{
        "label": "Dataset Name",
        "data": [value1, value2, value3, ...],
        "backgroundColor": ["#FF0000", "#00FF00", "#0000FF"],
        "borderColor": ["#FF0000", "#00FF00", "#0000FF"],
        "borderWidth": 1
      }}
    ]
  }}
   }}

   Format the response as a valid JSON object.`,
);

// Prompt for generating the final graph component code
const generateGraphResponse = PromptTemplate.fromTemplate(
  `const generateGraphResponse = PromptTemplate.fromTemplate(
  Generate the graph using this data "{Json}" and 
   using this component, insert the data into that component "{Component}".
   Please ensure you include the necessary import statements for all dependencies like React, useEffect, useRef, motion, gsap, etc.
   Only modify the data part of the component, and do not change any animations or other static elements. 
   Return only the modified component code as a plain string, with no markdown and no other text. Ensure that the component works with client-side rendering by adding the "use client" directive if needed.`,
);

export async function generateJson(promptData) {
  try {
    const prompt = await promptTemplatetogenerateJson.format({
      prompt: promptData,
    });
    const response = await model.invoke(prompt);
    const jsonResponse = await parser.parse(response.content);

    console.log("Graph JSON response:", jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("Error generating graph JSON:", error);
    throw error;
  }
}

export async function generateGraph(JsonResponse) {
  try {
    const graphType = JsonResponse.type.toLowerCase(); // Determine graph type

    // Read the chart component file
    const componentCode = componentTemplates[graphType];

    const prompt = await generateGraphResponse.format({
      Json: JSON.stringify(JsonResponse), // Pass the JSON response
      Component: componentCode,
    });

    const response = await model.invoke(prompt);
    const cleanedResponse = response.content
      .replace(/```javascript\s*|\s*```/g, "")
      .trim();

    console.log(cleanedResponse); // Final graph component code
    return cleanedResponse;
  } catch (error) {
    console.error("Error generating graph component:", error);
    throw error;
  }
}

const componentTemplates = {
  pie: `
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
         <h2 className="text-3xl font-bold mb-6">Interactive Pie Chart</h2>
         <svg ref={chartRef} width="400" height="400" viewBox="0 0 400 400">
           {data.map((item, index) => {
             const angle = (item.value / total) * 360;
             const endAngle = startAngle + angle;
             const largeArcFlag = angle > 180 ? 1 : 0;
             const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
             const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
             const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
             const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);


             const pathData = [
               \`M \${centerX},\${centerY}\`,
               \`L \${startX},\${startY}\`,
               \`A \${radius},\${radius} 0 \${largeArcFlag},1 \${endX},\${endY}\`,
               "Z",
             ].join(" ");


             const midAngle = startAngle + angle / 2;
             const labelX = centerX + (radius + 30) * Math.cos((midAngle * Math.PI) / 180);
             const labelY = centerY + (radius + 30) * Math.sin((midAngle * Math.PI) / 180);


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
 `,
  bar: `
   import React, { useEffect, useRef } from "react";
   import { motion } from "framer-motion";
   import { gsap } from "gsap";


   // Custom color definitions (replace with your desired colors)
   const colors = {
     primary: "#FF5733",
     secondary: "#33FF57",
     tertiary: "#3357FF",
     quaternary: "#FF33A6",
     quinary: "#FFD633"
   };


   const InteractiveBarChart = () => {
     const chartRef = useRef(null);


     const data = [
       { label: "2019", value: 65, color: colors.primary },
       { label: "2020", value: 59, color: colors.secondary },
       { label: "2021", value: 80, color: colors.tertiary },
       { label: "2022", value: 81, color: colors.quaternary },
       { label: "2023", value: 95, color: colors.quinary },
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


     const maxValue = Math.max(...data.map(item => item.value));
     const chartHeight = 300;
     const barWidth = 60;
     const chartWidth = data.length * barWidth + (data.length - 1) * 20;


     return (
       <div className="flex flex-col items-center justify-center p-8">
         <h2 className="text-3xl font-bold mb-6">Interactive Bar Chart</h2>
         <svg ref={chartRef} width={chartWidth} height={chartHeight + 50} viewBox=\`\${chartWidth} \${chartHeight + 50}\`>
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
                   style={{ transformOrigin: \`\${x + barWidth / 2}px \${chartHeight}px\` }}
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
                   {item.value}%
                 </text>
               </g>
             );
           })}
         </svg>
       </div>
     );
   };


   export default InteractiveBarChart;
 `,
  line: `
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


     const maxValue = Math.max(...data.map(item => item.value));
     const chartWidth = 400;
     const chartHeight = 300;
     const padding = 40;


     const xScale = (index) => (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding;
     const yScale = (value) => chartHeight - (value / maxValue) * (chartHeight - 2 * padding) - padding;


     const linePath = data.map((item, index) => \`\${index === 0 ? "M" : "L"} \${xScale(index)} \${yScale(item.value)}\`).join(" ");


     return (
       <div className="flex flex-col items-center justify-center p-8">
         <h2 className="text-3xl font-bold mb-6">Interactive Line Chart</h2>
         <svg ref={chartRef} width={chartWidth} height={chartHeight} viewBox=\`\${chartWidth} \${chartHeight}\`>
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
 `,
  bubble: `
 import React, { useEffect, useRef } from "react";
 import { motion } from "framer-motion";
 import { gsap } from "gsap";


 const getColorArray = (length) => {
   const colors = [
     "#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFD633", "#33FFF6", "#FF8C33",
     "#9B33FF", "#FF3333", "#33FF85"
   ];
   return colors.slice(0, length);
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
       <h2 className="text-3xl font-bold mb-6">Interactive Bubble Chart</h2>
       <svg ref={chartRef} width={chartWidth} height={chartHeight} viewBox={\`0 0 \${chartWidth} \${chartHeight}\`}>
         {data.map((item, index) => (
           <g key={item.label}>
             <motion.circle
               className="bubble"
               cx={item.x * 4}
               cy={chartHeight - item.y * 3}
               r={item.size}
               fill={colorArray[index]}
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
`,
  radar: `
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


   const areaPath = data
     .map((item, index) => {
       const { x, y } = getCoordinates(index, item.value);
       return \`\${index === 0 ? "M" : "L"} \${x} \${y}\`;
     })
     .join(" ") + "Z";


   return (
     <div className="flex flex-col items-center justify-center p-8">
       <h2 className="text-3xl font-bold mb-6">Interactive Radar Chart</h2>
       <svg
         ref={chartRef}
         width={chartSize}
         height={chartSize}
         viewBox={\`0 0 \${chartSize} \${chartSize}\`}
       >
         {[20, 40, 60, 80, 100].map((level, index) => (
           <polygon
             key={level}
             points={data
               .map((_, i) => {
                 const { x, y } = getCoordinates(i, level);
                 return \`\${x},\${y}\`;
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
           fill="#4CAF50"
           fillOpacity="0.5"
           stroke="#388E3C"
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
                 fill="#FF9800"
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
`,
};
