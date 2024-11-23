import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DynamicScatterPlot = () => {
  // Include data directly in the component
  const data = [
    { x: 10, y: 30 },
    { x: 20, y: 50 },
    { x: 30, y: 45 },
    { x: 40, y: 70 },
    { x: 50, y: 90 },
    { x: 60, y: 80 },
    { x: 70, y: 100 },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Scatter Plot</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="x"
            name="X-Axis"
            label={{ value: 'X-Value', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            dataKey="y"
            name="Y-Axis"
            label={{ value: 'Y-Value', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Dataset 1" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicScatterPlot;
