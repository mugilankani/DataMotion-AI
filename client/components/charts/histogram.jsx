import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DynamicHistogram = () => {
  // Include data directly in the component
  const data = [
    { name: '0-10', frequency: 30 },
    { name: '11-20', frequency: 50 },
    { name: '21-30', frequency: 75 },
    { name: '31-40', frequency: 60 },
    { name: '41-50', frequency: 45 },
    { name: '51-60', frequency: 20 },
    { name: '61-70', frequency: 10 },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Frequency Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="name" label={{ value: 'Range', position: 'insideBottom', offset: -5 }} />
          <YAxis
            label={{
              value: 'Frequency',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="frequency" fill="#8884d8" barSize={40} name="Frequency" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicHistogram;
